const db = require('./database')

module.exports = (query) => {
    return new Promise(function(resolve, reject) {
        db.query(query, function(err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
}