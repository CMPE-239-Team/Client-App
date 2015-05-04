var express = require('express')
,	mongoClient = require('mongodb').MongoClient
, http = require('http')
, path = require('path')
, url = require('url')
, myModule = require('./my_module.js')
, config = require('./config.js');

var app = express();

//all environments
app.set('port', 3000);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use('/public', express.static(path.resolve('./public')));

var db;

/*
 * Connection pooling to minimize database overheads
 */
mongoClient.connect("mongodb://"+config.mongo.user_name+":"+config.mongo.password+"@ds031962.mongolab.com:31962/tsa_demo", function(err, database) {
	if(err) {
		throw err;
	}
	db = database;
});

app.get("/", function(req, res) {
	//res.send('<h1 style="color:gray;">Welcome!!</h1>');
	res.render("index");
});

app.get("/view1", function(req, res) {
	/*	db.collection('collection1', function (err, connection){
		console.log("in view1 get request");
		if(err){
			console.log("Error in fetching tweets collection : \n" + err);
			db.close();
		} else {
			console.log("in view1 get request mymodulecall");
			myModule.getData(err, connection, function(data) {
				console.log("in view1 get request mymodulecall getdata");
				//console.log(data);
				res.render("view1", {tweets : JSON.stringify(data)});
			});
		}
	});
	 */
	res.render("view1");
});

app.get("/getAllTweets", function(req, res) {

	console.log(" Demo Param : "+req.params.demoParam);
	db.collection('collection1', function (err, connection){
		console.log("in getalltweets get request");
		if(!err) {
			console.log("in getalltweets get request mymodulecall");
			myModule.getCountOfSentiment(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});

app.get("/view2", function(req, res) {
	db.collection('collection2', function (err, connection){
		if(err){
			console.log("Error in fetching tweets collection : \n" + err);
			db.close();
		} else {
			myModule.getData(err, connection, function(data) {
				//console.log(data);
				res.render("view2", {tweets : JSON.parse(data)});
			});
		}
	});

});

app.get("/view3", function(req, res) {
	db.collection('collection3', function (err, connection){
		if(err){
			console.log("Error in fetching tweets collection : \n" + err);
			db.close();
		} else {
			myModule.getData(err, connection, function(data) {
				//console.log(data);
				res.render("view3", {tweets : data});
			});
		}
	});
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
