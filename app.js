// Module dependencies.
var express = require('express')
var app = module.exports = express.createServer()
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json'))
var exec = require('child_process').exec
var im = require('./lib/image-magick.js')

function sendImage(err, res, path){
  if(err) return // render 500
  res.contentType('image/gif')
  res.send(require('fs').readFileSync(path))
//    res.sendfile(path)
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

app.get(/^\/resize.*/, function(req, res){
  im.convert('resize', req.query['url'], req.query, function(err, path){
    sendImage(err, res, path)
  })
})

app.get(/^\/fit.*/, function(req, res){
  im.convert('fit', req.query['url'], req.query, function(err, path){
    sendImage(err, res, path)
  })
})

app.get(/^\/crop.*/, function(req, res){
  console.log(req.query)
  im.convert('crop', req.query['url'], req.query, function(err, path){
    sendImage(err, res, path)
  })
})


// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port)
  console.log("Express server listening on port %d", app.address().port)
}
