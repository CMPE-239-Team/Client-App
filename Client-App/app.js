var express = require('express')
,	mongoClient = require('mongodb').MongoClient
, http = require('http')
, path = require('path')
, url = require('url')
, myModule = require('./my_module.js')
, config = require('./config.js');

var app = express();
app.use(express.bodyParser());

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
	res.render("index");
});


app.get("/pie-chart", function(req, res) {
	res.render("pie-chart");
});

app.get("/bar-chart", function(req, res) {
	res.render("bar-chart");
});

app.get("/tweet-map", function(req, res) {
	res.render("tweet-map");
});

app.get("/dashboard", function(req, res) {
	res.render("dashboard");
});



app.post("/getSentiment", function(request, response) {
	var searchQuery = request.body.query;
	console.log("query received and processed "+searchQuery);
	
	var output = '';
	var options = {
	  host: ' http://sentimentanalyzer-sjsuprojects.rhcloud.com',
	  path: '/sentimentAnalysis/search?query='+searchQuery,
	  method: 'GET'
	};

	var req = http.get(options, function(res) {
	  res.on('data', function(chunk) {
		output += chunk;
	  }).on('end', function() {
		console.log('STATUS: ' + res.statusCode);
		console.log('OUTPUT : '+ output);
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});

	req.end();
	
	response.render("dashboard");
});



app.get("/getAllTweets", function(req, res) {

	console.log(" Demo Param : "+req.params.demoParam);
	db.collection('TweetResult', function (err, connection){
		console.log("in getalltweets get request");
		if(!err) {
			console.log("in getalltweets get request mymodulecall");
			myModule.getCountOfSentiment(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getAllHashTags", function(req, res) {

	console.log(" Demo Param : "+req.params.demoParam);
	db.collection('HashCount', function (err, connection){
		console.log("in getAllHashTags get request");
		if(!err) {
			console.log("in getalltweets get request mymodulecall");
			myModule.getHashCount(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getTweetFeed", function(req, res) {

	console.log(" Demo Param : "+req.params.demoParam);
	db.collection('TweetResult', function (err, connection){
		console.log("in getTweetFeed get request");
		if(!err) {
			console.log("in getTweetFeed get request mymodulecall");
			myModule.getTweetFeed(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getSentimentByLocation", function(req, res) {

	console.log(" Demo Param : "+req.params.demoParam);
	db.collection('collection1', function (err, connection){
		console.log("in getalltweets get request");
		if(!err) {
			console.log("in getalltweets get request mymodulecall");
			myModule.getSentimentByLocation(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
