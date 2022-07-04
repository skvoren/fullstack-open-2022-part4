const Blog = require('../models/blog')

const initialBlogs = [
    {
        author: 'Vladislav Zed',
        likes: 12
    },
    {
        author: 'Anastasya Zed',
        likes: 27
    }
]

const nonExistingId = async () => {
    const blog = new Blog(
        {
            author: 'Artem Dzuba',
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

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}
