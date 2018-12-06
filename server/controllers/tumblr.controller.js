const Promise = require('bluebird');
const request = require('request');
const downloadService = require('../services/downloader');
const userLikesService = require('../services/userLikes');
const fetcherService = require('../services/urlFetcher');
const resourceservice = require('../services/resource');
const _ = require('lodash');

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
      console.log(urls)
      var items = resourceservice.upload_resource(urls)
      if ('_links' in response && 'next' in response._links) {
        var before = response._links.next.query_params.before
        res.send(response._links)
      } else {
        res.send(end)
      }
      
    }).catch(e => {
      res.send(e)
    })

};

