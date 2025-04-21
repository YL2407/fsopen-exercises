const mongoose = require('mongoose');

if(process.argv.length<3){
    console.log("Provide password as an argument")
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ylyounes24:${password}@phonecluster.yjy6hjm.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=phonecluster`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length >=5){
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name,
        number
    })
    
    person.save().then(result=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close();
    })
}else{
    Person.find({}).then(result=>{
        result.forEach(p=>{
            console.log(p)
        })
        mongoose.connection.close();
    })
}

