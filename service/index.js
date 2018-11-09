const Hapi = require('hapi')
const routes = require('./routes')
// start server
const server = Hapi.server({
    host: 'localhost',
    port: 8000,
    routes: {
        validate: {
            failAction: (request, h, err) => {
                throw err
            }
        }
    }
})

// define server logs
server.log(['error', 'read'])

// set routes
routes(server)

module.exports = server
