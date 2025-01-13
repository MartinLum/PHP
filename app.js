const express = require('express');
const {ObjectId} = require('mongodb');//We get the MongoDB id
const {connectToDb, getDb} = require('./db');//We get the connectToBDB object and getDb

const app = express();
app.use(express.json())//have du jsn


/**
 * Connect to the database and start the server
 * @param {function} cb - Callback function to execute after connection
 */
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () =>{
            console.log('app listening on port 3000')
        });
        db = getDb()
    }
})




/**
 * Get all books from the database
 * @route GET /books
 * @returns {Object} 200 - An array of books
 * @returns {Error}  500 - Internal server error
 */
app.get('/books', (req, res) => {
    let books = []
    
    db.collection('books')
        .find()
        .sort({author: 1})
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch documents'})
        })
});


/**
 * Get a book by ID from the database
 * @route GET /books/:id
 * @param {string} id - Book ID
 * @returns {Object} 200 - A book object
 * @returns {Error}  500 - Internal server error
 */
app.get('/books/:id', (req, res) =>{
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the document'})
        })
    } else {
        res.status(500).json({error: 'Not valid doc id'})
    }

})
/**
 * Create a new book in the database
 * @route POST /books
 * @param {Object} req.body - Book object
 * @param {string} req.body.title - Title of the book
 * @param {string} req.body.author - Author of the book
 * @param {number} req.body.pages - Number of pages
 * @param {number} req.body.rating - Book rating
 * @returns {Object} 201 - Created book object with generated ID
 * @returns {Error} 500 - Internal server error
 */
app.post('/books/', (req, res) =>{
    const book = req.body
    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not fetch documents'})
        })
})

/**
 * Delete a book from the database
 * @route DELETE /books/:id
 * @param {string} id - Book ID to delete
 * @returns {Object} 200 - Delete operation result
 * @returns {Error} 500 - Internal server error or invalid ID
 */
app.delete('/books/:id', (req, res) =>{
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not delete the document'})
        })
    } else {
        res.status(500).json({error: 'Not valid doc id'})
    }
})

/**
 * Update a book in the database
 * @route PATCH /books/:id
 * @param {string} id - Book ID to update
 * @param {Object} req.body - Book fields to update
 * @returns {Object} 200 - Update operation result
 * @returns {Error} 500 - Internal server error or invalid ID
 */
app.patch('/books/:id', (req, res) =>{
    let updates = req.body
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set:updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not update the document'})
        })
    } else {
        res.status(500).json({error: 'Not valid doc id'})
    }
})

