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
	console.log("in getData");
	connection.aggregate([{$group: {
		_id:"$tweet-sentiment-score",
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