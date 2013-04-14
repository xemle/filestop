module.exports = {
    development: {
        db: "mongodb://localhost/filestoredbdev",
        uploadDir: __dirname + "/../../uploads",
        salt: "secretsalt",
        port: 8000
    },
    production: {
        db: "mongodb://localhost/filestoredb",
        uploadDir: __dirname + "/../../uploads",
        salt: "secretsalt",
        port: 8080
    }
}