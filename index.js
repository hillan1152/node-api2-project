const server = require('./express/server.js')

server.listen(4000, () => {
    console.log(`\n *** Server Running On  http://localhost:4000 *** \n`)
})