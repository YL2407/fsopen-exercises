const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (req, res, next) => {
  const authorization = req.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    req.token = authorization.replace('Bearer ', '')
    return next();
  }
  req.token=null;
  return next();
}

const userExtractor = async (req, res, next) => {
  if(req.token==null){
    req.user=null;
    return next();
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(!decodedToken.id){
      return res.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id);
    req.user=user
    return next()
}

module.exports = {
  getTokenFrom,
  userExtractor
}