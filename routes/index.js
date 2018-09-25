var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var url = 'mongodb://localhost:27017';
var dbName = 'sampsite';

router.get('/thelist', function(req, res, next){

	MongoClient.connect(url, function(err, client){
		if(err){
			console.log("Unable to connect to the database", err)
		}else{
	  		var db = client.db(dbName);
		    var collection = db.collection('students');
		    collection.find({}).toArray(function(err, docs) {
		    	if(err){
					res.send(err)
		    	}else if(docs.length){
				    res.render('studentlist', {
						'studentlist': docs
					})
		    	}else{
					res.send('No documents found')		    		
		    	}

	        })
		}

	})

})

router.get('/newstudent', function(req, res){
	res.render('newstudent', { title: 'Add Student' });
})

router.post('/addstudent', function(req, res){
	MongoClient.connect(url, function(err, client){
		if(err){
			console.log("Unable to connect to the database", err)
		}else{
	  		var db = client.db(dbName);
		    var collection = db.collection('students');
		    var student = {
		    	student: req.body.student,
		    	street: req.body.street,
		    	city: req.body.city,
		    	state: req.body.state,
		    	sex: req.body.sex,
		    	gpa: req.body.gpa
		    }
		    collection.insert([student], function(err, result){

		    	if(err){
		    		console.log(err)
		    	}else{
		    		res.redirect("thelist")
		    	}


		    })
		}

	})	
})

router.get('/student/:id', function(req, res, next){
	console.log(req.params.id);
	var student = null;
	var objectId = new ObjectID(req.params.id);
	MongoClient.connect(url, function(err, client){
		if(err){
			console.log("Unable to connect to the database", err)
		}else{
	  		var db = client.db(dbName);
		    var collection = db.collection('students');
		    collection.find({'_id': objectId}).toArray(function(err, docs) {
		    	if(err){
					res.send(err)
		    	}else if(docs.length){
    				  res.render('student', {
					  title: 'Edit Student',
					  id: req.params.id,
					  student: docs[0]
					})
		    	}else{
					res.send('No documents found')		    		
		    	}

	        })
		}		
	})

})

router.post('updatestudent', function(req, res){
	MongoClient.connect(url, function(err, client){
		if(err){
			console.log("Unable to connect to the database", err)
		}else{
	  		var db = client.db(dbName);
		    var collection = db.collection('students');
		    var student = {
		    	student: req.body.student,
		    	street: req.body.street,
		    	city: req.body.city,
		    	state: req.body.state,
		    	sex: req.body.sex,
		    	gpa: req.body.gpa
		    }
		    collection.update([student], function(err, result){

		    	if(err){
		    		console.log(err)
		    	}else{
		    		res.redirect("thelist")
		    	}


		    })
		}

	})	
})

module.exports = router;
