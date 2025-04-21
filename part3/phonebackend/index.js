require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express();

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res)=>{
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  const range = 100000;
  const id = Math.floor(Math.random()*100000);
  if(persons.find(p=>p.id===String(id))) return generateId();
  return String(id)
}

app.get('/api/persons', (req, res)=>{
    Person.find({}).then(persons=>res.json(persons))
})

app.get('/api/persons/:id', (req, res, next)=>{
    Person.findById(req.params.id).then(person=>res.json(person)).catch(e=>next(e));
})

app.delete('/api/persons/:id', (req, res, next)=>{
    Person.findByIdAndDelete(req.params.id).then(res.status(204).end()).catch(e=>next(e));
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons=>{
      res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toLocaleString()}</p>`)
    })
})

app.post('/api/persons' , (req, res, next)=>{
  const body = req.body

  const person = new Person({
    name:body.name,
    number:body.number
  });

  person.save().then(savedPerson=>{res.json(savedPerson)}).catch(e=>next(e))
})

app.put('/api/persons/:id', (req, res, next)=>{
  const {name, number} = req.body;
  Person.findById(req.params.id).then(person=>{
    if(!person){
      return res.status(404).end()
    }
    person.name=name;
    person.number=number;
    person.save().then(updatedPerson=>{
      res.json(updatedPerson)
    }).catch(error=>next(error))
  })
})

const errorHandler = (e, req, res, next) => {
  console.error(e.message);
  
  if(e.name==='CastError'){
    return res.status(400).send({error: 'malformed id'})
  }else if(e.name==='ValidationError'){
    return res.status(400).json({error: e.message})
  }
  
  next(errorHandler);
}


app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT);