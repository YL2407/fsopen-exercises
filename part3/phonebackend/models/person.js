const mongoose = require('mongoose');


const password = process.argv[2];

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false);

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
const personSchema = mongoose.Schema({
    name: {
      type: String,
      minLength:3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      validate:
      {
        validator: (v)=>{
          const s = v.split("-");
          if(!s.length==2){
            return false;
          }
          if(!(s[0].length==2 || s[0].length==3)){
            return false;
          }
          const regex = /^\d+$/;
          return regex.test(s[0])&&regex.test(s[1]);
        },
        message: props => `${props.value} is not a valid phone number`
      },
      required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)