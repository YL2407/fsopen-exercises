import { useState, useEffect } from 'react'
import personService from './services/personService'


const Notification = ({message, type}) => {
  const notifStyle = {
    color: type==='red'?'red':'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  if(message===null){
    return null
  }
  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}

const Filter = ({value, onChange}) => {
  return(
    <div>
      filter according to: <input value={value} onChange={onChange}/>
    </div>
  )
}

const PersonForm = ({text, value, onChange}) => {
  return(
    <div>
      {text}: <input value={value} onChange={onChange}/>
    </div>
  )
}

const Persons = ({persons, filter, handleDelete}) => {
  return (
    <div>
      <ul>
          {persons.filter((p)=>p.name.toLowerCase().includes(filter.toLowerCase()) ||
          p.number.toLowerCase().includes(filter.toLowerCase())).map((p)=><div key={p.name}>
            <li >{p.name} {p.number}</li>
            <button onClick={handleDelete(p)}>delete</button>
            </div>)}
      </ul>
    </div>
  )
}


const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons=>{
      setPersons(initialPersons);
    })
  }, [])
  

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) =>{
    setFilter(event.target.value);
  }

  const handleDelete = (person) => () => {
    if(window.confirm(`Delete ${person.name}`))
    personService.remove(person.id).then(setPersons(persons.filter(p=>p.id!==person.id)));
  }

  const updateNumber = (personObject, id) => {
    return personService
      .putNumber(personObject, id)
      .then(returnedPerson=>setPersons(persons.map(p=>p.id===returnedPerson.id?returnedPerson:p)))
  }

  const pushNotif = (message) =>{
    setMessage(message, 'green');
    setTimeout(()=>{
      setMessage(null)
    }, 5000);
  }



  const handleClick = (event) =>{
    event.preventDefault();
    let existing = persons.find((p)=>p.name===newName);
    const personObj = {
      name: newName,
      number: newNumber
    }
    if(!existing){ 
      personService.create(personObj).then(returnedPerson=>setPersons(persons.concat(returnedPerson)))
      setNewName('');
      setNewNumber('');
      pushNotif(`Added ${newName}`)
    }
    else{
      if(window.confirm(`${newName} has already been added to the phonebook, replace the old number with a new one?`)){
        updateNumber(personObj, existing.id)
          .then(()=>pushNotif(`Updated ${newName}`))
          .catch(err=>{
            pushNotif(`Information of ${personObj.name} has already been removed from server`, 'red')
            setPersons(persons.filter(p=>p.id!==existing.id))
          });  
      }
      setNewName('');
      setNewNumber('');
      
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <div>
        <Filter value={filter} onChange={handleFilterChange}/>
      </div>
      <form>
        <h2>Add a new person</h2>
        <PersonForm text="name" value={newName} onChange={handleNameChange}/>
        <PersonForm text="number" value={newNumber} onChange={handleNumberChange}/>
        <div>
          <button type="submit" onClick={handleClick}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App