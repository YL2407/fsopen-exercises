const {totalLikes, dummy, favoriteBlog, mostBlogs, mostLikes} = require('../utils/list_helper')
const { test, describe } = require('node:test')
const assert = require('node:assert')
const lodash = require('lodash')

describe('dummy', ()=>{
  test('returns 1 with empty params', ()=>{
    const blogs = []
    assert.strictEqual(dummy(blogs), 1)
  })
  test('returns 1 with non-empty params', ()=>{
    const blogs = ["hello", "blog1", "non-generic", "blog2"]
    assert.strictEqual(dummy(blogs), 1)
  })

})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const listWithMultipleBlogs = listWithOneBlog.concat([
    {
      _id: '5a422aa71b54a676234d1238',
      title: 'no problems detected',
      author: 'Anony Mous',
      url: 'nosuchthing.com',
      likes: 10,
      _v: 0
    },
    {
      _id: '5a4221471b54a676234d1238',
      title: 'are there any problems?',
      author: 'John Doe',
      url: 'nonexistent.com',
      likes: 12,
      _v: 0
    },
  ])

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('with 0 blogs, the sum is 0', ()=>{
    const listWithNoBlogs = []
    assert.strictEqual(totalLikes(listWithNoBlogs), 0)
  })

  test('works with multiple blogs', ()=>{
    const result = totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 27)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]
  test('null when empty list', ()=>{
    assert.strictEqual(favoriteBlog([]), null)
  })
  test('finds max likes in regular list', ()=>{
    assert.deepStrictEqual(favoriteBlog(blogs), blogs[2])
  })
  test('selects sole element when there is only one', ()=>{
    const listWithOneBlog = [blogs[0]];
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })
})

describe('most blogs', ()=>{
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]
  test('works with normal list', ()=>{
    assert.deepStrictEqual(mostBlogs(blogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
  test('works with empty list', ()=>{
    assert.deepStrictEqual(mostBlogs([]), null)
  })
  test('works with multiple maxes', ()=>{
    const option1 = {
      author: "Edsger W. Dijkstra",
      blogs: 3
    }
    const option2 = {
      author: "Robert C. Martin",
      blogs: 3
    }
    const result = mostBlogs(blogs.concat({
      _id: "5a422aa71b54a676231217f8",
      title: "Code is Code",
      author: "Edsger W. Dijkstra",
      url: "hedidntactuallywritethis.com",
      likes: 7,
      __v: 0
    }))
    assert.ok(lodash.isEqual(result, option1)||lodash.isEqual(result, option2));
  })

})

describe('most likes', ()=>{
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]
  test('works with normal list', ()=>{
    assert.deepStrictEqual(mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
  test('works with empty list', ()=>{
    assert.deepStrictEqual(mostLikes([]), null)
  })
  test('works with multiple maxes', ()=>{
    const option1 = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const option2 = {
      author: "Robert C. Martin",
      likes: 17
    }
    const result = mostLikes(blogs.concat({
      _id: "5a422aa71b54a676231217f8",
      title: "Code is Code",
      author: "Robert C. Martin",
      url: "hedidntactuallywritethis.com",
      likes: 5,
      __v: 0
    }))
    assert.ok(lodash.isEqual(result, option1)||lodash.isEqual(result, option2));
  })

})