// Run $ expresso

var app = require('../app')
  , assert = require('assert')
  , fs = require('fs')
  , exec = require('child_process').exec


module.exports = {
  'GET /': function(done){
    assert.response(app,
      { url: '/' },
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
        assert.includes(res.body, 'Hello');
        done()
      });
  },
  'simple resize works': function(done){
    assert.response(app,
      { url: '/resize?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x400' },
      { status: 200, headers: { 'Content-Type': 'image/gif' }},
      function(res){
        var path = [process.cwd(), 'tmp', 'test.gif'].join('/')
        fs.writeFileSync(path, res.body, 'raw')
        exec("identify "+path, function(err, stdout){
          console.log(err)
          assert.equal(stdout, '200x400')
          done()
        })
      });
  }
};
