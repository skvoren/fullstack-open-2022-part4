const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/users', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/users', async (request, response) => {
    const {username, name, password} = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400)
            .json({error: 'username must be unique'})
    }

    if (!password) {
        return response.status(400)
            .json({error: 'password must be filled'})
    }

    if (password.length < 4) {
        return response.status(400)
            .json({error: 'password must be valid'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User(
        {
            username,
            name,
            passwordHash
        }
    )

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter
