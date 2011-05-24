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
          , target = Helpers.testImageTargetPath
          
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
          , target = Helpers.testImageTargetPath
          
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
          , target = Helpers.testImageTargetPath
          
        Helpers.requestServer('/crop/magic?url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10'), {toFile: target}, function() {
          Helpers.exec('identify ' + target, cb)
        })
      },
      'resizes the image to 200x100': function(err, stdout) {
        assert.equal('wtf should it do?', 'wth')
        assert.ok(typeof stdout != 'undefined')
        assert.includes(stdout, "200x400")
      }
    },
    'with valid hash': {
      topic: function() {
        var target  = Helpers.testImageTargetPath
          , query   = 'url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10')
          , hash    = Helpers.utils.hash(query)
          
        Helpers.requestServer('/crop/' + hash + '?' + query, this.callback)
      },
      'works nicely': function(err, stdout) {
        assert.includes(stdout, 'GIF89')
      }
    },
    'with invalid hash': {
      topic: function() {
        var target  = Helpers.testImageTargetPath
        Helpers.requestServer('/crop/asdeasd?url=' + srcImgUrl + '&crop=' + encodeURIComponent('200x400+10+10'), this.callback)
      },
      "doesn't work": function(err, stdout) {
        assert.includes(stdout, "Hash mismatch")
      }
    }
  }
}).addBatch(Helpers.clearTmpFolderBatch).run()