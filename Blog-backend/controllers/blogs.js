const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/get-all', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/create', async (request, response, next) => {
	const body = request.body

	const blog = new Blog({
		author: body.author,
		likes: body.likes
	})

	try {
		const savedBlog = await blog.save()
		response.status(201).json(savedBlog)
	} catch (e) {
		next(e)
	}
})

module.exports = blogsRouter
