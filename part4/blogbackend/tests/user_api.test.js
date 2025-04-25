const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')
const helper = require('./test_helper')


const api = supertest(app)

describe('invalid user creation denied', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  test('username too short fails with error message', async () => {
    const user = {
      username: 'ab',
      name: 'abc',
      password: 'abcdefgh'
    }
    let response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
    assert.strictEqual(response.body.error.includes('is shorter than the minimum allowed length (3)'), true)
  })
  test('password too short fails with error message', async () => {
    const user = {
      username: 'abc',
      name: 'abc',
      password: 'ab'
    }
    let response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
    assert.strictEqual(response.body.error, 'Password shorter than minimum required length of 3')
  })
  after(async () => {
    await mongoose.connection.close()
  })
})

