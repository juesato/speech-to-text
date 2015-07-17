var http = require("http");
var request = require("request");
var fs = require("fs");

function urlEncode(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var apiUrl = 'https://www.google.com/speech-api/v2/recognize?'

var params = urlEncode({
	'output': 'json',
	'lang': 'en-us',
	'pfilter': 1,
	'maxResults': 3,
	'key': 'AIzaSyDpIPdx2BEmRMkYIF_2PVmnMN6-toj-klA'
});

var options = {
	'url': apiUrl + params,
	'headers': {
		'content-type': 'audio/x-flac; rate=' + 44100
	}
}

var source = fs.createReadStream('test.flac');
source.on('error', function (error) {console.log("Caught", error);});


source.pipe(
	request.post(options, function(error, res, body) {
		console.log(body);
		console.log("res");
		console.log(res);
	})
);