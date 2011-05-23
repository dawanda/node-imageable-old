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
        assert.equal(res.body.length, 6620)
        done()
//        done()
//        var path = [process.cwd(), 'tmp', 'test.gif'].join('/')
//        fs.writeFileSync(path, res.body)
//        exec("identify "+path, function(err, stdout){
//          assert.equal(stdout, '200x400')
//          done()
//        })
      });
  },

  'removes temp files': function(done){
    exec('ls -al tmp | wc -l', function(_,stdout){
      var files = parseInt(stdout)
      assert.response(app,
        { url: '/fit?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x400' },
        { status: 200, headers: { 'Content-Type': 'image/gif' }},
        function(res){
          exec('ls -al tmp | wc -l', function(_, stdout){
            var filesNew = parseInt(stdout)
            assert.equal(files, filesNew)
            done()
          })
        });
    })
  },

  'simple fit works': function(done){
    assert.response(app,
      { url: '/fit?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&size=200x400' },
      { status: 200, headers: { 'Content-Type': 'image/gif' }},
      function(res){
        assert.equal(res.body.length, 18035)
        done()
      });
  },

  'simple crop works': function(done){
    assert.response(app,
      { url: '/crop?url=http%3A%2F%2Fwww.google.com%2Fintl%2Fen_ALL%2Fimages%2Flogo.gif&crop=200x400%2B10%2B10' },
      { status: 200, headers: { 'Content-Type': 'image/gif' }},
      function(res){
        assert.equal(res.body.length, 6825)
        done()
      });
  }
};
