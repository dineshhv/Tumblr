
require('dotenv').config();
const express = require('express');
const config = require('./config/config');

const downloadService = require('./server/services/downloader');
const userLikesService = require('./server/services/userLikes');
const fetcherService = require('./server/services/urlFetcher');
const resourceservice = require('./server/services/resource');
const _ = require('lodash');
var cron = require('node-cron');
var cache = require('memory-cache');

const app = express();
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
      console.log(response)
    }).catch(e => {
      console.log(e)
    })
  console.log('running a task every minute');
});
module.exports = require('./config/express')(app, config);


app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});

