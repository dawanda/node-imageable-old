var assert    = require('assert')
  , vows      = require('vows')
  , Helpers   = require("./helpers")
  , srcImgUrl = encodeURIComponent("http://www.google.com/intl/en_ALL/images/logo.gif")
  

vows.describe('app').addBatch({
  'GET /': {
    topic: function() { Helpers.requestServer('/', this.callback) },
    'returns Hello World': function(err, stdout, stderr) {
      assert.includes(stdout, 'Hello World')
    }
  },
  'GET /resize': {
    'simple resize': {
      topic: function() {
        var cb     = this.callback
          , target = Helpers.testImagePath
          
        Helpers.requestServer("/resize/magic?url=" + srcImgUrl + "&size=200x400", {toFile: target}, function() {
          Helpers.exec('identify ' + target, cb)
        })
      },
      'resizes the image to 200x80': function(err, stdout) {
        assert.ok(typeof stdout != 'undefined')
        assert.includes(stdout, "200x80")
      }
    }
  },
  'GET /fit': {
    'simple fit': {
      topic: function() {
        var cb     = this.callback
          , target = Helpers.testImagePath
          
        Helpers.requestServer("/fit/magic?url=" + srcImgUrl + "&size=200x400", {toFile: target}, function() {
          Helpers.exec('identify ' + target, cb)
        })
      },
      'resizes the image to 200x400': function(err, stdout) {
        assert.ok(typeof stdout != 'undefined')
        assert.includes(stdout, "200x400")
      }
    }
  },
  'GET /crop': {
    'simple crop': {
      topic: function() {
        var cb     = this.callback
          , target = Helpers.testImagePath
          
        Helpers.requestServer('/crop/magic?url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400'), {toFile: target}, function() {
          Helpers.exec('identify ' + target, cb)
        })
      },
      'resizes the image to 200x400': function(err, stdout) {
        assert.ok(typeof stdout != 'undefined')
        assert.includes(stdout, "200x400")
      }
    }
  }
}).run()

//   'simple crop works': function(done){
//     assert.response(app,
//       { url: '/crop/magic?url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10') },
//       { status: 200, headers: { 'Content-Type': 'image/gif' }},
//       function(res){
//         assert.equal(res.body.length, 6825)
//       }
//     );
//   },
// 
//   'can resize when hash matches': function(done){
//     var query = 'url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10')
//     var hash = utils.hash(query)
// 
//     assert.response(app,
//       { url: '/crop/'+hash+'?'+query },
//       {},
//       function(res){
//         assert.equal(res.body.length, 6825)
//       });
//   },
// 
//   'cannot resize when hash does not match': function(done){
//     assert.response(app,
//       { url: '/crop/asdeasd?url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10') },
//       {},
//       function(res){
//         assert.includes(res.body, "Hash")
//       });
//   }
// };
