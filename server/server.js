var express = require('express'),
    files = require('./routes/files'),
    filestops = require('./routes/filestops');

var app = express();

app.configure(function() {
    app.set('title', 'filestop');
    app.set('version', '0.1');

    app.use(express.bodyParser());

    app.use(express.static(__dirname + '/../app'));
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/files', files.findAll);
app.get('/files/:id', files.findById);
app.post('/files', files.add);
app.put('/files/:id', files.update);
app.delete('/files/:id', files.delete);

app.get('/filestops', filestops.findAll);
app.get('/filestops/:id', filestops.findById);
app.get('/filestops/files/:id', filestops.findAllFiles);
app.post('/filestops', filestops.add);
app.put('/filestops/:id', filestops.update);
app.delete('/filestops/:id', filestops.delete);


app.get('/api', function(req, res){
    res.send('hello world');
});

app.listen(8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});