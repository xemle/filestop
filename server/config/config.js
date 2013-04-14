var path = require('path');

module.exports = {
    development: {
        db: "mongodb://localhost/filestopdbdev",
        uploadDir: path.normalize(__dirname + "/../../uploads"),
        baseURL: "http://localhost:8000",
        salt: "secretsalt",
        port: 8000
    },
    production: {
        db: "mongodb://localhost/filestopdb",
        uploadDir: path.normalize(__dirname + "/../../uploads"),
        baseURL: "http://localhost:8000",
        salt: "secretsalt",
        port: 8080
    }
}
