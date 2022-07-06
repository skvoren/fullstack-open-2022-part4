const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
})

describe('checks get all blogs works correctly', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test('specific blog are returned correctly', async () => {
		const response = await api.get('/api/blogs')

		const author = response.body.map(i => i.author)

		expect(author).toContain('Vladislav Zed')
	})

	test('unique id returned correctly', async () => {
		const response = await api.get('/api/blogs')

		const id = response.body.map(i => i.id)

		expect(id).toBeDefined()
	})
})

describe('get specific blog via id', () => {
	test('success with a valid id', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const blogToView = blogsAtStart[0]

		const resultBlog = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

		expect(resultBlog.body).toEqual(processedBlogToView)
	})

	test('fails with status 404 if blog is not exists', async () => {
		const validNonExistingId = await helper.nonExistingId()

		await api
			.get(`/api/blogs/${validNonExistingId}`)
			.expect(404)
	})

	test('fails with status 400 if id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.get(`/api/blogs/${invalidId}`)
			.expect(400)
	})
})

describe('checks blog can be created correctly', () => {
	test('blog with valid data can be added', async () => {
		const newBlog = (
			{
				author: 'Mika Hakkinen',
				title: 'World Champion 98-98',
				url: 'Mclaren',
				likes: 24
			}
		)

		await api
			.post('/api/blogs')
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

	test('fails with status 400 if data is invalid', async () => {
		const newBlog = (
			{
				author: 'Michael Schumacher'
			}
		)

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})
})

describe('checks blog can be deleted correctly', () => {
	test('succeeds with status 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const authors = blogsAtEnd.map(i => i.author)

		expect(authors).not.toContain(blogToDelete.author)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
