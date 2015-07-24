var gspeech = require('gspeech-api');
console.time("transcribe");

var file = '/home/juesato/5mins.wav';
var file2 = '/home/juesato/Downloads/michio.wav';
// gspeech.recognize('strang.wav', function(err, data) {
gspeech.recognize(file2, function(err, data) {
// gspeech.recognize('data/80.wav', function(err, data) {
    if (err) 
        console.error(err);
    console.timeEnd("transcribe");
    var timed = data.timedTranscript;
    console.log("Timed Transcript -----");
    for (var i = 0; i < timed.length; i++) {
    	console.log(timed[i].start + " " + timed[i].text);
    }
});
