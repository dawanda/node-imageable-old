// Module dependencies.
var express = require('express')
var app = module.exports = express.createServer()
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json'))
var exec = require('child_process').exec

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

// Magick

function rand(number){
  return parseInt(Math.random() * number);
}

function resizeImage(url, geometry, callback) {
  var temp = [__dirname, "tmp", rand(99999999).toString()].join('/')
  var command = ["convert -strip -resize", geometry, url, temp].join(" ")
  console.log(command)
  exec(command, function (err, stdout, stderr) {
    callback(err, temp)
  });
}

// Routes
app.get('/', function(req, res){
  res.send('Hello World from node-imageable');
})

app.get(/^\/resize.*/, function(req, res){
  resizeImage(req.param('url'), req.param('size'), function(err, path){
    console.log(path)
    console.log(err)
    if(err) return // render 500
    console.log('asd')
    res.contentType('tmp/text2.gif')
//    res.contentType('image/gif')
//    res.send(require('fs').readFileSync(path))

    res.sendfile(path)
  })
})

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port)
  console.log("Express server listening on port %d", app.address().port)
}
