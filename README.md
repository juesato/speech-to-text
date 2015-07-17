# GSpeech API

A node.js wrapper library around the [Google Speech API](https://www.google.com/intl/en/chrome/demos/speech.html) for automatic speech recognition.

## Easy-to-use high-quality speech recognition

 * Unlimited requests to Google automatic speech recognition servers
 * Access to timed transcripts


## Basic Usage

For clips under 60 seconds, usage is simple:

```javascript
var gspeech = require('gspeech-api');
gspeech.recognize('path/to/my/file', function(err, data) {
	if (err) 
    	console.error(err);
    console.log("Final transcript is:\n" + data.transcript);
}
```

Google servers ignore clips over 60 seconds, so for clips longer than that, you have to specify how you want your audio files split into pieces. To use default package settings, the same code from above for clips under 60 seconds works.

## Installation

Gpseech-api relies on [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) to deal with different audio formats, which has a dependency on ffmpeg. You can install ffmpeg [HERE].

`npm install gspeech-api`

### Dependencies
 
 * request
 * fs
 * temp
 * async
 * fluent-ffmpeg

Fluent-ffmpeg has an additional requirement that ffmpeg is already installed on your system. You can install it [HERE]

## Documentation

This package exposes one main method, `gspeech.recognize(options, callback)` for taking a file and returning an array of timed captions along with a final transcript.

### Arguments

##### Options 
 * `file` - path to the audio file to be transcribed.  
 * `segments` (optional) - `[{'start': float, 'duration': float}]` Specifies how to divide the audio file into segments before transcription. `start` and `duration` are floats specifying times in seconds. If this argument is not specified, the audio is split according to natural pauses.

#### Callback

Callback is a function which will be called after all requests to Google speech servers have completed. It is passed two parameters `callback(err, data)`:
 * `err` - contains an error message, if error occurs
 * `data` - contains an Object with the following fields, if all requests are successful:
   * `transcript` - `String`: text of complete transcript
   * `rawCaptions` - `[{'start': float, 'dur': float, 'text': String}]`: unprocessed text of each segment transcribed separately by Google speech servers. If `options.segments` is specified, each object corresponds to a segment; otherwise, each object designates how the audio file was split before being transcribed.
   * `timedTranscript` - `[{'start': float, 'text': String}]`: timed transcript calculated from `rawCaptions` that determines the most likely text for each section of time with multiple possible transcriptions.


### Examples


#### Getting a timed transcript

```javascript
gspeech.recognize('path/to/my/file', function(err, data) {
	if (err) 
    	console.error(err);
    for (var i = 0; i < data.timedTranscript.length; i++) {
    	// Print the transcript
    	console.log(data.timedTranscript[i].start + ': ' \
        		  + data.timedTranscript[i].text + '\n');
    }
}
```

#### Minimal splitting of an audio file

```javascript
gspeech.recognize('path/to/my/file', function(err, data) {
	if (err) 
    	console.error(err);
    for (var i = 0; i < data.timedTranscript.length; i++) {
    	// Print the transcript
    	console.log(data.timedTranscript[i].start + ': ' \
        		  + data.timedTranscript[i].text + '\n');
    }
}
```

### gspeech.getAudioLength(file)

A helper method which returns the length of an audio file, in seconds.

### Example

```javascript

```

## Disclaimer

This is not an officially supported Google API, and should only be used for personal purposes. The API is subject to change, and should not be relied upon by any crucial services.