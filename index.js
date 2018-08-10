const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body, null, 4))

morganFormat = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.body(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(morganFormat))
app.use(cors())

app.get('/api', (req, res) => {
    res.send('<h1>Hello api!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({}, { __v: 0 })
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person
        .findById(id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (req, res) => {
    Person
        .find({}, { __v: 0 })
        .then(persons => {
            res.send(`
            <div>
                <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                <p>${new Date()}</p>
            </div>`
            )
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person
        .findByIdAndRemove(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    Person
        .find({ name: body.name }, { __v: 0 })
        .then(result => {
            console.log(result)

            if (!body.name) {
                return res.status(400).send({ error: 'name missing' })
            } else if (!body.number) {
                return res.status(400).send({ error: 'number missing' })
            } else if (0 < result.length) {
                return res.status(400).send({ error: 'name must be unique' })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })

                person
                    .save()
                    .then(savedPerson => {
                        res.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(404).end()
                    })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const id = req.params.id

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    Person
        .findById(id)
        .then(person => {
            person
                .set({ number: body.number })
                .save()
                .then(updatedPerson => {
                    res.json(Person.format(updatedPerson))
                })
                .catch(error => {
                    console.log(error)
                    res.status(404).end()
                })
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})