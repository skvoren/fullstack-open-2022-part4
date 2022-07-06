const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const {request, response} = require('express')
const {errorHandler} = require('../utils/middleware')
const {toJSON} = require("lodash/seq");

blogsRouter.get('/blogs', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/blogs', async (request, response) => {
	const body = request.body

	const blog = new Blog({
		author: body.author,
		title: body.title,
		url: body.url,
		likes: body.likes,
	})

	const savedBlog = await blog.save()
	response.status(201).json(savedBlog)
})

blogsRouter.get('/blogs/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.delete('/blogs/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

module.exports = blogsRouter
