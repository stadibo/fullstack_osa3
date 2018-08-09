const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) => JSON.stringify(req.body, null, 4)  )

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

app.use(bodyParser.json())
app.use(morgan(morganFormat))
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/api', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(`
            <div>
                <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                <p>${new Date()}</p>
            </div>`
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const nameTaken = persons.find(p => p.name === body.name)

    if ( !body.name ) {
        return res.status(400).json({ error: 'name missing' })
    } else if ( !body.number ) {
        return res.status(400).json({ error: 'number missing' })
    } else if ( nameTaken ) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const id = Number(req.params.id)

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.map(p => p.id !== id ? p : person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})