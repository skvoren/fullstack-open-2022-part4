const dummy = (blogs) => {
    if (blogs) {
        return 1
    }
}

const likes = (blogs) => {
    let result = 0
    blogs.map(blog => result += blog.likes)
    return result
}

const favoriteBlog = (blogs) => {
    let result
    let maxLikes = 0
    blogs.map(blog => {
        if (blog.likes > maxLikes) {
            result = blog
            maxLikes = blog.likes
        }
    })
    return result
}

const mostBlogs = (blogs) => {
    let result = {
        author: '',
        blogs: 0
    }
    let blogsForFilter = blogs
    blogs.forEach(blog => {
        let countOfBlogs = blogsForFilter.filter(blogItem => blogItem.author === blog.author).length
        if (countOfBlogs > result.blogs) {
            result.author = blog.author
            result.blogs = countOfBlogs
        }
    })
    return result
}

const mostLikes = (blogs) => {
    let result = {
        author: '',
        likes: 0
    }
    let blogsForLikesCount = blogs
    blogs.forEach(blog => {
        let author = blog.author
        let likesCount = 0
        blogsForLikesCount.map(blogItem => {
            if (author === blogItem.author) {
                likesCount += blogItem.likes
            }
        })
        if (likesCount > result.likes) {
            result.author = author
            result.likes = likesCount
        }
    })

    return result
}

module.exports = {
    dummy,
    likes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
