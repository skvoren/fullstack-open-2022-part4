const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require("./test_helper");
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('checks at least one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({
            username: 'root',
            passwordHash
        })

        await user.save()
    })

    test('creation user returns code 201 if done correctly', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'recurro',
            name: 'Vlad Zaionchkovskiy',
            password: 'qwerty123!',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation user returns code 400 if name already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = (
            {
                username: 'root',
                name: 'Superuser',
                password: 'admin123!'
            }
        )

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})

describe('checks validation for user creation', () => {
    test('return status 400 if user length incorrect', async () => {
        const userWithIncorrectUsername = ({
            username: 'ru',
            name: 'Vladislav',
            password: 'admin123!'
        })

        const result = await api
            .post('/api/users')
            .send(userWithIncorrectUsername)
            .expect(400)
    })

    test('return status 400 if password-length incorrect', async () => {
        const userWithIncorrectPassword = (
            {
                username: 'ladannik',
                name: 'Vlad',
                password: 'av'
            }
        )

        const result = await api
            .post('/api/users')
            .send(userWithIncorrectPassword)
            .expect(400)

        expect(result.body.error).toContain('password must be valid')
    })

    test('return 400 if username empty', async () => {
        const incorrectUserWithoutUsername = (
            {
                name: 'Vlad',
                password: 'admin123!'
            }
        )

        await api
            .post('/api/users')
            .send(incorrectUserWithoutUsername)
            .expect(400)
    })

    test('return 400 if password empty', async () => {
        const incorrectUserWithoutPassword = (
            {
                name: 'Vlad',
                username: 'recurro',
            }
        )

        const result = await api
            .post('/api/users')
            .send(incorrectUserWithoutPassword)
            .expect(400)

        expect(result.body.error).toContain('password must be filled')
    })
})
