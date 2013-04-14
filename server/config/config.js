module.exports = {
    development: {
        db: "mongodb://localhost/filestopdbdev",
        uploadDir: __dirname + "/../../uploads",
        salt: "secretsalt",
        port: 8000
    },
    production: {
        db: "mongodb://localhost/filestopdb",
        uploadDir: __dirname + "/../../uploads",
        salt: "secretsalt",
        port: 8080
    }
}