const Promise = require('bluebird');
const request = require('request');
const downloadService = require('../services/downloader');
const userLikesService = require('../services/userLikes');
const fetcherService = require('../services/urlFetcher');
const resourceservice = require('../services/resource');
const _ = require('lodash');
var cron = require('node-cron');
var cache = require('memory-cache');

module.exports.getTumblr = function (req, res, next) {
  var before = req.query.before;
  var limit = req.query.limit;
  var after = req.query.after;
  var query = {}
  if (after) {
    query.after = after
  }
  if (before) {
    query.before = before
  }
  if (limit) {
    query.limit = limit
  }
  userLikesService.get_likes(query)
    .then(response => {
      var urls = fetcherService.fetch(response.liked_posts)
      var items = resourceservice.upload_resource(urls)
      if ('_links' in response && 'next' in response._links) {
        var before = response._links.next.query_params.before
        console.log(before)
        res.send(before)
      } else {
          res.send(end)
      }
      
    }).catch(e => {
      res.send(e)
    })

};


cron.schedule('5 * * * *', () => {
 console.log("Cron Running")
  var before = cache.get('before')
  var query = {}
  if (before) {
    query.before = before
  }
  query.limit = 20
  userLikesService.get_likes(query)
    .then(response => {
      var urls = fetcherService.fetch(response.liked_posts)
      var items = resourceservice.upload_resource(urls)
      if ('_links' in response && 'next' in response._links) {
        var before = response._links.next.query_params.before
        cache.put('before', before);
      }
      res.send(response)
    }).catch(e => {
      res.send(e)
    })
  console.log('running a task every minute');
});
