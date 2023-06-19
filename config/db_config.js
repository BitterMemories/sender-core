const dbName = 'sender-core'

let dbConfig = {

    db : {
        host: '34.201.128.53',
        user: 'root',
        password: 'sender@secret',
        database: dbName,
        connectionLimit : 10
    },
}

module.exports = dbConfig