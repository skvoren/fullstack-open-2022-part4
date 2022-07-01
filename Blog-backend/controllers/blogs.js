const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/get-all', (request, response) => {
	Blog
		.find({})
		.then((blogs) => {
			response.json(blogs)
		})
})

blogsRouter.post('/create', (request, response, next) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then((result) => {
			response.status(201).json(result)
		})
		.catch((error) => next(error))
})

module.exports = blogsRouter
