var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var dbName = 'filestoredb';
var collectionName = "filestops";
var filesCollectionName = "files";
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(dbName, server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to " + dbName + " database");
        db.collection(collectionName, {safe:true}, function(err, collection) {
            if (err) {
                console.log("The " + dbName + " collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ' + collectionName + ': ' + id);
    db.collection(collectionName, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection(collectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllFiles = function(req, res) {
    var id = req.params.id;
    console.log('FindAllFiles ' + collectionName + ': ' + id);
    db.collection(filesCollectionName, function(err, collection) {
        collection.find({filestop: id}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var file = req.body;
    console.log('Adding filestop: ' + JSON.stringify(file));
    db.collection(collectionName, function(err, collection) {
        collection.insert(file, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var files = req.body;
    delete files._id;
    console.log('Updating ' + collectionName + ': ' + id);
    console.log(JSON.stringify(files));
    db.collection(collectionName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, files, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating files: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(files);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ' + collectionName + ': ' + id);
    db.collection(collectionName, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};