const dummy = (blogs) => {
    if (blogs) {
        return 1
    }
}

const likes = (blogs) => {
    let result = 0
    if (blogs) {
        blogs.map(blog => result += blog.likes)
    }
    return result
}

module.exports = {
    dummy,
    likes
}
