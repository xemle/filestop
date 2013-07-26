var path = require('path');

module.exports = {
    development: {
        db: "mongodb://localhost/filestopdbdev",
        uploadDir: path.normalize(__dirname + "/../../uploads"),
        baseURL: "http://localhost:8000",
        path: false,
        behindProxy: false,
        salt: "secretsalt",
        port: 8000,
        defaultExpireOffset: 600 // expire time in seconds: 5 Minutes
    },
    production: {
        db: "mongodb://localhost/filestopdb",
        uploadDir: path.normalize(__dirname + "/../../uploads"),
        baseURL: "http://localhost:8000",
        /**
         * Sub directory after base URL if filestop should not run in
         * the root directory. If you have a setting like http://localhost:8000/fs
         * your path should be set to '/fs'
         */
        path: false,
        /**
         * Set to true if filestop is behind another proxy
         */
        behindProxy: false,
        salt: "secretsalt",
        port: 8080,
        defaultExpireOffset: 86400 * 90 // expire time in seconds: 60 days
    }
};
