const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "test 1",
    author: "tester 1",
    url: "test1.com",
    likes: 1
  },
  {
    title: "test 2",
    author: "tester 2",
    url: "test2.com",
    likes: 2
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}