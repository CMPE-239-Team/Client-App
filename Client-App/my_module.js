exports.getData = function(err, connection, callback) {
	console.log("in getData");
	connection.find().toArray(function(err, result) {
		console.log("in getData find");
		if(err){
			console.log("Error in find : \n" + err);
			return JSON.parse('Error in fetching tweet details');
		} else if(result) {
			console.log("in getData find result");
			console.log(result);
			callback(result);
		}
	});
};

exports.getCountOfSentiment = function(err, connection, callback) {
	console.log("in getCountOfSentiment");
	// change id value here
	connection.find({_id: 'abcdefgh123'}, {positiveCount: 1, negativeCount: 1, neutralCount: 1 }).toArray( 
			function(err, result) {
				console.log("in getCountOfSentiment find");
				if(err){
					console.log("Error in find : \n" + err);
					return JSON.parse('Error in fetching tweet details getCountOfSentiment');
				} else if(result) {
					console.log("in getCountOfSentiment find result");
					console.log(result);
					callback(result);
				}
			});
};


exports.getSentimentByLocation = function(err, connection, callback) {
	console.log("in getSentimentByLocation");
	connection.aggregate([{$group: {
		_id:"",
		lat:"$lat",
		lng:"$lng",
		tweetSentimentScore:"$tweet-sentiment-score",
		totalQuantity: {$sum: 1}
	}
	}]).toArray( 
			function(err, result) {
				console.log("in getCountOfSentiment find");
				if(err){
					console.log("Error in find : \n" + err);
					return JSON.parse('Error in fetching tweet details getCountOfSentiment');
				} else if(result) {
					console.log("in getCountOfSentiment find result");
					console.log(result);
					callback(result);
				}
			});
};



exports.getHashCount = function(err, connection, callback) {
	console.log("in getHashCount");
	// change id value here
	connection.find({_id: 'abcdefg123'}, {hashTags: 1}).toArray( 
			function(err, result) {
				console.log("in getCountOfSentiment find");
				if(err){
					console.log("Error in find : \n" + err);
					return JSON.parse('Error in fetching tweet details getHashCount');
				} else if(result) {
					console.log("in getHashCount find result");
					console.log(result);
					callback(result);
				}
			});
};



exports.getTweetFeed = function(err, connection, callback) {
	console.log("in getTweetFeed");
	// change id value here
	connection.find({_id: 'abcdefgh123'}, {tweetList: 1}).toArray( 
			function(err, result) {
				console.log("in getTweetFeed find");
				if(err){
					console.log("Error in find : \n" + err);
					return JSON.parse('Error in fetching tweet details getTweetFeed');
				} else if(result) {
					console.log("in getTweetFeed find result");
					console.log(result);
					callback(result);
				}
			});
};
