const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = 'mongodb://@ds119072.mlab.com:19072/fullstack-puhnro'

mongoose.connect(url)

let personSchema = new Schema({
    name: String,
    number: String
})

personSchema.statics.format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person