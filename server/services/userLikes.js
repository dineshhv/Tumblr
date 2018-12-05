const Promise = require('bluebird');
const request = require('request');
const _ = require('lodash');
var tumblr = require('tumblr.js');

var client = tumblr.createClient({
    consumer_key: process.env.CONSUMERKEY,
    consumer_secret: process.env.CONSUMERSECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKENSECRET
});

module.exports.get_likes = function (query) {
  return new Promise(function (resolve, reject) {
    client.userLikes(query, function (err, data) {
        if (err) { reject(err) }
        resolve(data)
      })
  })
};
