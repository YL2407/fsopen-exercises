const blogRouter = require('express').Router()
const { request } = require('../app');
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1});
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
  try {
    if(!(request.user && request.token)){
      response.status(401).json({error: 'unauthorized access'})
    }
    const body = request.body;

    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({error: error.message})
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try{
    if(!(request.user && request.token)){
      response.status(401).json({error: 'unauthorized access'})
    }
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if(blog.user.toString() === user.id){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }else {
      return response.status(401).json({error: 'token invalid'})
    }
  }catch(error){
    response.status(400).json({error: error.message})
  }
})

blogRouter.put('/:id', async (request, response) => {
  try {
    const {title, author, url, likes} = request.body
    let blog = await Blog.findById(request.params.id);
    if(!blog){
      return response.status(404).end()
    }
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({error: error.message})
  }
  
})

module.exports = blogRouter
