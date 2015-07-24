var request = require('request');

var options = {
	'url': 'http://www.google.com',
	'pool': {
		'maxSockets': 3
	}	
};
for (var i = 0; i < 100; i++) {
	request.get(options, (function(j) {
		return function(err, res, body) {
	    	console.log("response " + j);
	    }
	})(i)).on('socket', (function(j) {
		return function(socket) {
			console.log("socket " + j);
		}
	})(i));	
}
