module.exports = function (app) {

    var files = require('../controllers/files');
    app.post('/files', files.create);
    app.get('/files', files.findAll);
};