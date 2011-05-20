// Module dependencies.
var express = require('express')
var app = module.exports = express.createServer()

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
  res.render('index', {
    title: 'Express'
  })
})

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000)
  console.log("Express server listening on port %d", app.address().port)
}
