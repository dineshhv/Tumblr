const Promise = require('bluebird');
const request = require('request');
const _ = require('lodash');

module.exports.fetch = function (blogData) {
  var urls = [];
  blogData.forEach(function (obj) {
    if (obj.type == 'photo') {
      if ('photos' in obj) {
        obj.photos.forEach(function (files, key) {
          try {
            var type = checkURL(files.original_size.url)
            var fileName
            if (obj.slug) {
              if (obj.slug == ' ' || obj.slug == '') {
                fileName = obj.id + '-file:' + key + '.' + type
              } else {
                fileName = obj.slug.replace(/ /g, '-') + '.' + type
              }
            } else {
              fileName = obj.id + '-file:' + key + '.' + type
            }
            urls.push({
              fileName,
              url: files.original_size.url,
              type: "IMAGE",
              tags: obj.tags
            })
          } catch (err) {
            console.log("*******************************************")
            console.log("PHOTO")
            console.log(' http' + m[1])
            console.log("*******************************************")

          }
        })
      }
    } else if (obj.type == 'text') {
      var name
      if (obj.slug) {
        if (obj.slug == ' ' || obj.slug == '') {
          name = obj.id + '-file:' + new Date().getTime()
        } else {
          name = obj.slug.replace(/ /g, '-')
        }
      } else {
        name = obj.id + '-file:' + new Date().getTime()
      }
      var m, rex = /<img[^>]+src="http([^">]+)/g;
      while (m = rex.exec(obj.trail[0].content_raw)) {
        try {
          var type = checkURL('http' + m[1])
          fileName = name + '.' + type


          urls.push({
            fileName,
            url: 'http' + m[1],
            type: "IMAGE",
            tags: obj.tags
          })
        } catch (err) {
          console.log("*******************************************")
          console.log("Text - Photo")
          console.log('http' + m[1])
          console.log("*******************************************")

        }
      }



      const regex = /{([^'>]+)/g;
      var m;
      while ((m = regex.exec(obj.trail[0].content_raw)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          try {
            if (match[0] != '{') {
              console.log("******************TEXT-VIDEO: JSON FAILED*************************")
              match = '{' + match
            }
            
            var json = JSON.parse(match)
            console.log("******************TEXT-VIDEO: JSON WORKED*************************")
            if (json && 'type' in json && json.type == "video") {
              var type = checkURL(json.media.url)
              fileName = name + '.' + type
              urls.push({
                fileName,
                url: json.media.url,
                type: "VIDEO",
                tags: obj.tags
              })
            }
          } catch (err) {
            console.log("*******************************************")
            console.log("Text - Video")
            console.log(match)
            console.log("*******************************************")
          }
        });
      }
      //   console.log(images)
      //   console.log(videos)
    } else if (obj.type == 'video') {
      try {
        var type = checkURL(obj.video_url)

        var fileName
        if (obj.slug) {
          if (obj.slug == ' ' || obj.slug == '') {
            fileName = obj.id + '-file:' + new Date().getTime() + '.' + type
          } else {
            fileName = obj.slug.replace(/ /g, '-') + '.' + type
          }
        } else {
          fileName = obj.id + '-file:' + new Date().getTime() + '.' + type
        }
        urls.push({
          fileName,
          url: obj.video_url,
          type: "VIDEO",
          tags: obj.tags
        })
      } catch (err) {
        console.log("*******************************************")
        console.log("VIDEO")
        console.log(obj.video_url)
        console.log("*******************************************")
      }
    }

  });
  return urls
};


function checkURL(url) {
  var parts = url.split('.')
  return parts[parts.length - 1];
}
