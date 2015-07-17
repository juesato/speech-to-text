var http = require("http");
var request = require("request");
var fs = require("fs");

var API_KEY = 'AIzaSyDpIPdx2BEmRMkYIF_2PVmnMN6-toj-klA'

function urlEncode(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function genPair() {
	return parseInt(Math.random() * Math.pow(2, 32)).toString(16);
}

// var apiUrl = 'https://www.google.com/speech-api/v2/recognize?'

// var params = urlEncode({
// 	'output': 'json',
// 	'lang': 'en-us',
// 	'pfilter': 1,
// 	'maxResults': 3,
// 	'key': 'AIzaSyDpIPdx2BEmRMkYIF_2PVmnMN6-toj-klA'
// });

var pair = genPair();

var upstreamUrl = 'https://www.google.com/speech-api/full-duplex/v1/up?';
var upstreamParams = urlEncode({
	'output': 'json',
	'lang': 'en-us',
	'pfilter': 1,
	'key': API_KEY,
	'client': 'chromium',
	'pair': pair
});
var upstreamOpts = {
	'url': upstreamUrl + upstreamParams + '&' + ['continuous', 'interim'].join("&"),
	'headers': {
		'content-type': 'audio/x-flac; rate=' + 44100
	}	
};

var downstreamUrl = 'https://www.google.com/speech-api/full-duplex/v1/down';
var downstreamParams = urlEncode({
	'pair': pair
});
var downstreamOpts = {
	'url': downstreamUrl + '?' + downstreamParams
};

// var options = {
// 	'url': apiUrl + params,
// 	'headers': {
// 		'content-type': 'audio/x-flac; rate=' + 44100
// 	}
// }


var source = fs.createReadStream('test.flac');
source.on('error', function (error) {console.log("Caught", error);});

source.pipe(
	request.post(upstreamOpts, function(error, res, body) {
		if (error) {
			console.log("Error");
			console.log(error);
		}
		console.log("UPSTREAM");
		console.log(body);
		// console.log("res");
		// console.log(res);
	})
);	

request.get(downstreamOpts, function(error, res, body) {
	if (error) {
		console.log("Error");
		console.log(error);		
	}

	console.log("DOWNSTREAM");
	console.log(body);
});

console.log("Sent off everything");
console.log(upstreamOpts);
console.log(downstreamOpts);
