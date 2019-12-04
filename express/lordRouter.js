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
    const id = req.params.id;
    const data = req.body;

    db.findPostComments(data.text)
        .then(comment => {
            if(comment.length > 0) {
                res.status(200).json(data.text)
            } else {
                db.findById(id)
                    .then(post => {
                        if(post.length > 0){
                            res.status(404).json({
                                message: "The post with the specified ID does not contain comments."
                            });
                        } else {
                            res.status(404).json({ message: "The post with the specified ID does not exist."
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "The post information could not be retrieved. " 
                        });
                    });
            }
        })
        .catch((err => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        }))
})

// POST Request
router.post('/', (req, res) => {
    const dbData = req.body;
    console.log(dbData)
    if(!dbData.title || !dbData.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(dbData)
            .then(post => {
                res.status(201).json({...post, ...dbData })
            })
            .catch(err => {
                console.log('POST Req Err', err)
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})

// DELETE REQUEST

// export router
module.exports = router;