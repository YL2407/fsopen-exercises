const lodash = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((t,c)=>t+c.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length>0? blogs.reduce((t,c)=>t.likes>c.likes?t:c):null
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = lodash.countBy(blogs, 'author');
  const topAuthor = lodash.maxBy(lodash.keys(authorCounts), author => authorCounts[author]);

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  };
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) {
    return null;
  }

  const authorCounts = lodash.groupBy(blogs, 'author');
  const topAuthor = lodash.maxBy(lodash.keys(authorCounts), author=>totalLikes(authorCounts[author]))

  return {
    author: topAuthor,
    likes: totalLikes(authorCounts[topAuthor])
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}