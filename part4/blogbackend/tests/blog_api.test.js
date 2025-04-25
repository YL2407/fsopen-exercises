const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')


const api = supertest(app)

const validToken = async () => {
  // const user = {
  //   username: "tester",
  //   name: "tester",
  //   password: "test"
  // }
  const loginDetails = {
    username:"tester",
    password:"test"
  }
  // await api.post('/api/users').send(user)
  const res = await api.post('/api/login').send(loginDetails)
  return res._body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await validToken();
})

test('blogs are returned as json and in correct number', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)

})

//test id
test('blog ids are returned under correct name', async () => {
  let blogs = await Blog.find({})
  blogs = blogs.map(b=>b.toJSON())
  blogs.forEach(b=>{
    assert.ok(!b._id && b.id);
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "test 3",
    author: "tester 3",
    url: "test3.com",
    likes: 3
  }

  const token = await validToken();

  await api
    .post('/api/blogs')
    .set("Authorization", "Bearer "+token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('test 3'))
})

test('missing likes dealt with by adding 0', async () => {
  const newBlog = {
    title: "test 4",
    author: "tester 4",
    url: "test4.com"
  }

  const token = await validToken();

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer '+token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const likes = blogsAtEnd.map(b => b.likes)
  assert(likes.includes(0))
})

test('400 bad request if no title or url', async ()=>{
  const noTitle = {
    url: 'test5.com',
    author: 'tester 5',
    likes: 5
  }

  const token = await validToken();

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' +token)
    .send(noTitle)
    .expect(400)

  const noUrl = {
    title: 'test 6',
    author: 'tester 6',
    likes: 6
  }
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' +token)
    .send(noUrl)
    .expect(400)
})

test('deletion succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: "test 4",
    author: "tester 4",
    url: "test4.com"
  }

  const token = await validToken();

  
  const res = await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer '+token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogToDelete = res._body

  await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', 'Bearer '+token).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(n => n.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('updating works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  let blogToUpdate = blogsAtStart[0];
  blogToUpdate.likes = 11
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length===blogsAtStart.length, true);
  const likes = blogsAtEnd.map(b=>b.likes);
  assert.strictEqual(likes.includes(11), true);
})

test('adding fails with code 401 if no token', async () => {
  const newBlog = {
    title: "test 3",
    author: "tester 3",
    url: "test3.com",
    likes: 3
  }


  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

})

after(async () => {
  await mongoose.connection.close()
})