var express = require('express')
, mongoClient = require('mongodb').MongoClient
, http = require('http')
, path = require('path')
, url = require('url')
, myModule = require('./my_module.js')
, config = require('./config.js');

var app = express();
app.use(express.bodyParser());

//all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddress',process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use('/public', express.static(path.resolve('./public')));

var db;
var search_id = "55529b57e4b0819b8b524549";

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
	search_id = "555273a3e4b0819b8b524530"
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
	//console.log("query received and processed "+searchQuery);
	
	var output = '';
	var options = {
	  host: 'sentimentanalyzer-sjsuprojects.rhcloud.com',
	  path: '/sentimentAnalysis/search?query='+searchQuery,
	  method: 'GET'
	};

	var s = 'http://sentimentanalyzer-sjsuprojects.rhcloud.com/sentimentAnalysis/search?query='+searchQuery;
	//console.log(s);
	var req = http.request(s, function(res) {
	  res.on('data', function(chunk) {
	  	//console.log('--------------------------------------------------------------------------asdjasjdsad : '+ chunk);
		output += chunk;
	  });
	  
	  res.on('end', function() {
		//console.log('STATUS: ' + res.statusCode);
		//console.log('OUTPUT : '+ output);
		
		if(output != "" &&  output != "FAILURE" ) {
			var str = output.trim();
			//console.log("========>"+str);
			search_id = str;
		} 
		response.render("dashboard");
	  });
	});

	req.on('error', function(e) {
	  //console.log('ERROR: ' + e.message);
	});

	req.end();
});


app.get("/getAllTweets", function(req, res) {
	db.collection('TweetResult', function (err, connection){
		//console.log("in getalltweets get request");
		if(!err) {
			//console.log("in getalltweets get request mymodulecall");
			myModule.getCountOfSentiment(err, connection, search_id, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getAllHashTags", function(req, res) {
	db.collection('HashCount', function (err, connection){
		//console.log("in getAllHashTags get request");
		if(!err) {
			//console.log("in getalltweets get request mymodulecall");
			myModule.getHashCount(err, connection, search_id, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getTweetFeed", function(req, res) {
	db.collection('TweetResult', function (err, connection){
		//console.log("in getTweetFeed get request");
		if(!err) {
			//console.log("in getTweetFeed get request mymodulecall");
			myModule.getTweetFeed(err, connection, search_id, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


app.get("/getSentimentByLocation", function(req, res) {
	db.collection('collection1', function (err, connection){
		//console.log("in getalltweets get request");
		if(!err) {
			//console.log("in getalltweets get request mymodulecall");
			myModule.getSentimentByLocation(err, connection, function(data) {
				res.send(JSON.stringify(data));
			});
		}
	});
});


http.createServer(app).listen(app.get('port'), app.get('ipaddress'), function(){
	//console.log('Express server listening on port ' + app.get('port'));
});
