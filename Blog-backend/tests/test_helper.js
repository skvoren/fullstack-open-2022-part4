const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require("bcrypt");

const initialBlogs = [
	{
		title: 'Fullstack',
		url: 'JS',
		author: 'Vladislav Zed',
		likes: 12
	},
	{
		title: 'Best wife',
		url: 'kitchen',
		author: 'Anastasya Zed',
		likes: 27
	}
]

const nonExistingId = async () => {
	const blog = new Blog(
		{
			author: 'Artem Dzuba',
			title: 'Football player',
			url: 'Zenit FC',
			likes: 99
		}
	)

	await blog.save()
	await blog.remove()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	usersInDb
}
