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

// GET Request for specific posts
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            console.log(post)
            if(post[0]){
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

// GET Request for Comments
router.get('/:id/comments', (req, res) => {
    console.log(req.body)
})

// DELETE REQUEST

// export router
module.exports = router;