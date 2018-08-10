const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://@ds119072.mlab.com:19072/fullstack-puhnro'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const name = process.argv[2]
const number = process.argv[3]

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(response => {
            console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
            mongoose.connection.close()
        })

} else {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo')
            result.forEach(person => {
                console.log(person.name, ' ', person.number)
            })
            mongoose.connection.close()
        })
}