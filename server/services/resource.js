const Promise = require('bluebird'),
    _ = require('lodash'),
    fs = require('fs');
    var request = require('request');

var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
});

var s3 = new AWS.S3();

module.exports = {

    upload_resource: function (url) {
        var items = []
        var length = url.length
        url.forEach(function(element) {
            if(element.type == "IMAGE"){
                put_from_url(element.url, process.env.AWS_BUCKET+"/", element.fileName, 'IMAGE', function(err, res) {
                    if (err)
                        throw err;
                        items.push('Uploaded data successfully!');
                });
            } else if(element.type == "VIDEO"){
                put_from_url(element.url, process.env.AWS_BUCKET+"/", element.fileName, 'VIDEO', function(err, res) {
                    if (err)
                        throw err;
                        items.push('Uploaded data successfully!');
                });
            } else {
                console.log("NOT MY TYPE")
            }
            if(items.length==length){
                return items
            }
        });
       

    }
};


function put_from_url(url, bucket, key, directory, callback) {
    request({
        url: url,
        encoding: null
    }, function(err, res, body) {
        if (err)
            return callback(err, res);

        s3.putObject({
            Bucket: bucket +directory,
            Key: key,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        }, callback);
    })
}


