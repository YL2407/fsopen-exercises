const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body;
  if(password.length<3){
    return response.status(400).json({error: 'Password shorter than minimum required length of 3'})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if(error.name==='ValidationError'){
      return response.status(400).json({error: error.message})
    }
    else if(error.name==='MongoServerError' && error.message.includes('E11000 duplicate key error')){
      return response.status(400).json({error: 'expected `username` to be unique'})
    }
    return response.status(500).json({error: 'An error occurred, please try again'})
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title:1, author:1, url:1})
  response.json(users)
})

module.exports = usersRouter;