// Module dependencies.
var express = require('express')
var app = module.exports = express.createServer()
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json'))
var exec = require('child_process').exec
var im = require('./lib/image-magick.js')

app.hash = function(data){
  return require('crypto').createHash('md5').update(data+config.secret).digest("hex").slice(0,8)
}

app.hashMatches = function(hash, data){
  if(config.magic_hash == hash)return true;
  if(config.secret.toString().length == 0)return true;

  var generatedHash = app.hash(data)
  if(generatedHash == hash) return true;

  return false;
}

function sendImage(err, res, path){
  if(err) return // render 500
  res.contentType(path)
  res.sendfile(path)
}

// Configuration
app.configure(function(){
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
  app.use(express.errorHandler())
})

// Routes
app.get('/', function(req, res){
  res.send('Hello World from node-imageable');
})

var modify = /^\/(resize|crop|fit)(\/([^\/\?]+))?/ // resize/hash/...
app.get(modify, function(req, res) {
  var match = req.originalUrl.match(modify)
  var method = match[1]
  var hash = match[3]
  var query = req.originalUrl.match(/\?(.*)/)[1]

  if (app.hashMatches(hash, query)){
    im.convert(method, req.query['url'], req.query, function(err, path){
      sendImage(err, res, path)
    })
  } else {
    res.send("Hash mismatch")
  }
})

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port)
  console.log("Express server listening on port %d", app.address().port)
}
