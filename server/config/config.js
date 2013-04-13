module.exports = {
    development: {
        db: "mongodb://localhost/filestoredbdev",
        uploadDir: __dirname + "/../../uploads",
        port: 8000
    },
    production: {
        db: "mongodb://localhost/filestoredb",
        uploadDir: __dirname + "/../../uploads",
        port: 8080
    }
}