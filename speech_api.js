var http = require("http");
var request = require("request");
var fs = require("fs");
var temp = require("temp").track();
var ffmpeg = require('fluent-ffmpeg');
var async = require('async');

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

function getRequestOptions() {
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
	// var otherOpts = ['interim', 'continuous'];
	var otherOpts = ['continuous']
	var upstreamOpts = {
		'url': upstreamUrl + upstreamParams + '&' + otherOpts.join("&"),
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
	return [upstreamOpts, downstreamOpts];
}


function recognize(options) {
    var file = options.file;

	function getTranscriptFromServer(params, callback) {
		/* Called by processAudioSegment
		 * Takes a file specified in params, sends it to Google speech recognition server
		 * and runs callback on the returned transcript data
		 */

		if (!params.file) {
			console.error("No file is specified. Please specify a file path through params.file");
		}
		var file_name = params.file;
    	console.log("finish ffmpeg read");
    	console.log(file_name);
		var source = fs.createReadStream(file_name);
		source.on('error', function (error) {console.log("Caught", error);});

		var opts = getRequestOptions();
		var upstreamOpts = opts[0];
		var downstreamOpts = opts[1];
		source.pipe(
			request.post(upstreamOpts, function(error, res, body) {
				if (error) {
					console.error(error);
				}
			})
		);	

		request.get(downstreamOpts, function(error, res, body) {
			if (error) {
				console.error(error);		
			}

			console.log("DOWNSTREAM");
			console.log(file_name);
			console.log(body);
			var results = body.split('\n');
			var last_result = JSON.parse(results[results.length-2]); // last result is empty, so grab the second last
			callback(null, {
				'text': last_result.result[0],
				'start': params.start,
				'duration': params.duration
			});
		});
	}

	function processAudioSegment(data, callback) {
		/* Processes a segment of audio from file by using ffmpeg to convert
		 * a segment of specified start time and duration, save it as a temporary .flac file
		 * and send it to getTranscriptFromServer
		 */

		var start = data.start;
		var dur = data.duration;
		var tmpFile = temp.path({suffix: '.flac'});

		// Convert segment of audio file into .flac file
		ffmpeg()
			.on('error', function (err) {
		    	callback(err);
		  	})
		  	.on('end', function () {
		  		// After conversion has finished, get the transcript
		  		getTranscriptFromServer({
		  			'file': tmpFile,
		  			'start': start,
		  			'duration': dur
		  		}, callback);
			})
			.input(file)
			.setStartTime(start)
			.duration(dur)
			.output(tmpFile)
			.audioFrequency(44100)
			.toFormat('flac')
			.run();
	}

	// Get file information and divide into segments
	// Then process each of these segments individually, and combine results at the end
    ffmpeg.ffprobe(file, function (err, info) {
		var totalDuration = info.format.duration;
		var numSegments = Math.ceil(totalDuration / 5);
		var audioSegments = []
		for (var i = 0; i < numSegments; i++) {
			audioSegments.push({
				'start': 5*i,
				'duration': 10
			});
		}
		async.map(audioSegments, processAudioSegment, function(err, results) {
			// After all transcripts have been returned, process them
			console.log(results);
		});
    });
};

recognize({
 	'file': 'out-0.wav'
});