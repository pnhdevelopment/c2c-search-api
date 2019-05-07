// in src/index.js
const express = require('express')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')

const schema = require('./schema')
const mongo = require('./mongo')

const start = async() => {

    var app = express()

    app.use(cors())

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
    })

    const db = await mongo()
    const base_root = process.env.BASE_URL || ''

    app.use(base_root + '/graphql', graphqlHTTP(request => ({
        schema: schema,
        context: {
            datastore: {
                ...db
            }
        },
        graphiql: true
    })))

    app.use(base_root + '/healthcheck', require('express-healthcheck')());

    const PORT = process.env.PORT || 4000

    const server = app.listen(PORT, () => {
        console.log(`Listening at port ${server.address().port}, visit http://localhost:${server.address().port}${base_root}/graphql`);
    })
}

start()
