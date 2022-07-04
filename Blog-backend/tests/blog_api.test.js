const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogItem = new Blog(helper.initialBlogs[0])
    await blogItem.save()

    blogItem = new Blog(helper.initialBlogs[1])
    await blogItem.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/get-all')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/get-all')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('specific blog are returned correctly', async () => {
    const response = await api.get('/api/get-all')

    const author = response.body.map(i => i.author)

    expect(author).toContain('Vladislav Zed')
})

test('unique id returned correctly', async () => {
    const response = await api.get('/api/get-all')

    const id = response.body.map(i => i.id)

    expect(id).toBeDefined()
})

test('blog without field cannot be created', async () => {
    const newBlog = new Blog(
        {
            like: 0
        }
    )

    await api
        .post('/api/create')
        .send(newBlog)
        .expect(400)

    const blogsCheck = await helper.blogsInDb()
    expect(blogsCheck).toHaveLength(helper.initialBlogs.length)
})

test('blog with valid data can be added', async () => {
    const newBlog = (
        {
            author: 'Mika Hakkinen',
            likes: 24
        }
    )

    await api
        .post('/api/create')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(a => a.author)
    expect(authors).toContain(
        'Mika Hakkinen'
    )
})

test('if like property missed, sets 0 by default', async () => {
    const newBlog = (
        {
            author: 'Michael Schumacher'
        }
    )

    await api
        .post('/api/create')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const likesAtLastBlog = blogsAtEnd[blogsAtEnd.length - 1].likes
    expect(likesAtLastBlog).toBe(0)
})

afterAll(() => {
    mongoose.connection.close()
})
