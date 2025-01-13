const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
    /**
     * Connects to MongoDB database
     * @param {Function} cb - Callback function to execute after connection attempt
     * @returns {void}
     */
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/bookstore')
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    /**
     * Returns the database connection
     * @returns {object|null} MongoDB database connection object or null if not connected
     */
    getDb: () => dbConnection
}