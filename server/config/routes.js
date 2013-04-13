module.exports = function (app) {

    var files = require('../controllers/files');
    app.get('/files/:id', files.get);
    app.get('/files', files.findAll);
    app.post('/files', files.create);
};