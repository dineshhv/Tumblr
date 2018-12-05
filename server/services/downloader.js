const Promise = require('bluebird');
const request = require('request');
const _ = require('lodash');
const fs = require('fs');
const https = require('https');
const url = require('url');
// const exec = require('child_process').exec;
// const spawn = require('child_process').spawn;
// const sleep = require('sleep');

module.exports.download = function (query) {
  return new Promise(function (resolve, reject) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {

        // check if response is success
        if (response.statusCode !== 200) {
            reject('Response status was ' + response.statusCode);
        }

        response.pipe(file);
        file.on('response', function(res){
		  var len = parseInt(res.headers['content-length'], 10);
		  var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
		    complete: '=',
		    incomplete: ' ',
		    width: 20,
		    total: len
		  })
		});
        file.on('data', function (chunk) {
		    bar.tick(chunk.length);
		});
        file.on('finish', function() {
            file.close(); 
            resolve("done") // close() is async, call cb after close completes.
        });
    });

    // check for request error too
    request.on('error', function (err) {
        fs.unlink(dest);

        if (cb) {
            reject(err);
        }
    });

    file.on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)

        if (cb) {
            reject(err);
        }
    });
  })
};
