// Module dependencies.
var express  = require('express')
  , app      = module.exports = express.createServer()
  , Utils    = require("./lib/node-imageable/utils")
  , utils    = new Utils(__dirname + '/config/config.json')
  , im       = require('./lib/image-magick')
  , reporter = require('./lib/reporter')
  
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
  var start = +new Date()
  
  var match = req.originalUrl.match(modify)
  var method = match[1]
  var hash = match[3]
  var query = req.originalUrl.match(/\?(.*)/)[1]

  if (utils.hashMatches(hash, query)){
    im.convert(method, req.query['url'], req.query, function(err, path){
      reporter.timing('request', +new Date() - start)
      
      if(err) {
        res.send(500)
      } else {
        res.contentType(path)
        res.sendfile(path, function() { exec('rm ' + path) })
      }
    })
  } else {
    res.send("Hash mismatch")
  }
})

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(process.env.PORT || utils.getConfig().port)
  console.log("Express server listening on port %d", app.address().port)
  reporter.startReporting()
}
