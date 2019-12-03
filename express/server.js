const express = require('express');

const lordRouter = require('./lordRouter');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`Hope this works`)
})

server.use('/api/posts', lordRouter);

module.exports = server;