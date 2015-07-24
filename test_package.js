var gspeech = require('gspeech-api');
console.time("transcribe");
// gspeech.recognize('strang.wav', function(err, data) {
gspeech.recognize('Downloads/michio.wav', function(err, data) {
// gspeech.recognize('data/80.wav', function(err, data) {
    if (err) 
        console.error(err);
    console.timeEnd("transcribe");
    var timed = data.timedTranscript;
    console.log("Timed Transcript -----");
    for (var i = 0; i < timed.length; i++) {
    	console.log(timed[i].sta + " " + timed[i].text);
    }
});