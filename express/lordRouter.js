const express = require('express');

// Invoke Router
const router = express.Router();
// Import Data
const db = require('../data/db.js');

router.use(express.json());


// GET Request to return an array of data
router.get('/', (req, res) => {
    console.log(req.query)
    db.find(req.query)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log('Error in GET', err)
            res.status(500).json({
                message: 'Error retrieving data'
            })
        })
})

// POST Request for adding info inside of the request body
router.post('/', (req, res) => {
    console.log(req.body)
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
    db.insert(req.body)
        .then(data => {
            res.status(201).json({...req.body, data})
        })
        .catch(err => {
            console.log('Post Request Error', err)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }

})



// export router
module.exports = router;