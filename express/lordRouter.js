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

// POST A COMMENT
router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    if(!data.text){ // IF THERE IS NO TEXT, SEND ERROR
        res.status(404).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db.findById(id) // LOCATE ID
            .then(comment => {
                if(comment.id !== 0){ 
                    db.insertComment(data)
                        .then(post => {
                            console.log('This is post', post)
                            res.status(201).json({...data, ...post})   
                        })
                        .catch(err => {
                            console.log('COMMENT ERR', err)
                            res.status(404).json({ error: "There was an error while saving the comment to the database" })
                        })
                } else { 
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving ANYTHING to the database" })
            })
    }
}) 


// PUT REQUEST
// When the client makes a PUT request to /api/posts/:id:
// If the post with the specified id is not found:
//      return HTTP status code 404 (Not Found).
//      return the following JSON object: { message: "The post with the specified ID does not exist." }
// If the request body is missing the title or contents property:
    // cancel the request.
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide title and contents for the       post." }.
// If there's an error when updating the post:
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post information could not be modified." }.
// If the post is found and the new information is valid:
    // update the post document in the database using the new information sent in the request body.
    // return HTTP status code 200 (OK).
    // return the newly updated post.
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const postData = req.body;

    db.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if (!postData.title || !postData.contents){
                res.status(400).json({ errorMessage: "Please provide title and contents for the       post." })
            } else {
                db.update(id, postData)
                    .then(update => {
                        res.status(200).json({...update, ...postData})
                    })
                    .catch(err => {
                        console.log('ERROR With PUT', err)
                        res.status(500).json({ error: "The post information could not be modified." })
                    })
            }
        })
        .catch(err => {
            console.log('PUT IS RUINED', err)
        })
})


// DELETE REQUEST
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(removed => {
            if(removed){
                res.status(202).json({ message: `Removed successfully`})
                console.log(`${removed} Gone`)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(400).json({ error: 'The psot could not be removed'})
        })
})
// export router
module.exports = router;