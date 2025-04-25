const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

const mongoUrl = config.MONGODB_URI

logger.info(`connecting to MongoDB at url ${mongoUrl}`)

mongoose.connect(mongoUrl).then(()=>{
  logger.info('connected to MongoDB')
}).catch(e=>{
  logger.error('connection failed:', e.message)
})

app.use(express.json())
app.use(middleware.getTokenFrom)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app