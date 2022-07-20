const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	const user = await User.findById(body.userId)

	const blog = new Blog({
		author: body.author,
		title: body.title,
		url: body.url,
		likes: body.likes,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await blog.save()

	response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body

	const blog = {
		author: body.author,
		title: body.title,
		url: body.url,
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
	response.json(updatedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

module.exports = blogsRouter
