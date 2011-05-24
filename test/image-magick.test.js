var im      = require('../lib/image-magick')
  , assert  = require('assert')
  , fs      = require('fs')
  , exec    = require('child_process').exec
  , testImg = __dirname + '/test.gif'

module.exports = {
  'simple resize': function(){
    im.convert('resize', testImg, {size: '100x100'}, function(err, path){
      exec("identify " + path, function(err, stdout){
        assert.includes(stdout, '100x35')
      })
    })
  },

  'simple fit': function(){
    im.convert('fit', testImg, {size: '100x100'}, function(err, path){
      exec("identify " + path, function(err, stdout){
        assert.includes(stdout, '100x100')
      })
    })
  },

  'simple crop': function(){
    im.convert('crop', testImg, {crop: '10x15+20+25'}, function(err, path){
      exec("identify " + path, function(err, stdout){
        assert.includes(stdout, '10x15')
      })
    })
  },

  'crop with resize': function() {
    im.convert('crop', testImg, {crop: '10x15+20+25', size: '100x20'}, function(err, path){
      exec("identify " + path, function(err, stdout){
        assert.includes(stdout, '100x20')
      })
    })
  }
};
