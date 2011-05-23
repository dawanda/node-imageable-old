var im = require('../lib/image-magick.js')
  , assert = require('assert')
  , fs = require('fs')
  , exec = require('child_process').exec


module.exports = {
  'simple resize': function(){
    im.convert('resize', 'test/test.gif', '100x100', function(err, path){
      exec("identify "+path, function(err, stdout){
        assert.includes(stdout, '100x35')
      })
    })
  },

  'simple fit': function(){
    im.convert('fit', 'test/test.gif', '100x100', function(err, path){
      exec("identify "+path, function(err, stdout){
        assert.includes(stdout, '100x100')
      })
    })
  }
};
