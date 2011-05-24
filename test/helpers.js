var Utils = require(__dirname + "/../lib/node-imageable/utils")

var Helpers = module.exports = {
  exec:   require('child_process').exec,
  fs:     require('fs'),
  utils:  new Utils(__dirname + '/../config/config.example.json'),
  
  serverRequests: 0,
 
  clearTmpFolder: function() {
    Helpers.exec('rm ' + process.cwd() + "/test/tmp/*")
  },
  clearTmpFolderBatch: {
    'clear': {
      topic: function() {
        Helpers.clearTmpFolder()
        this.callback()
      },
      'make it so': function(){}
    }
  },
  requestServer: function(path, _options, _callback) {
    var app      = require('../app')
      , port     = !!app.fd ? app.address().port : (~~(Math.random() * 5000) + 2000)
      , url      = "http://localhost:" + port + path
      , options  = (typeof _options == 'function') ? {} : _options
      , callback = (typeof _options == 'function') ? _options : _callback
      , cmd      = "curl --silent '" + url + "'" + (options.toFile ? " > " + options.toFile : '')

    Helpers.serverRequests++

    if (!app.fd) {
      app.listen(port)
      console.log("Express server listening on port %d", app.address().port)
    }

    console.log(cmd)

    Helpers.exec(cmd, function(err, stdout, stderr) {
      callback && callback(err, stdout, stderr)
      if(--Helpers.serverRequests == 0) {
        app.close()
        app.__listening = false
      }
    })
  }
}

Helpers.__defineGetter__('random', function() {
  return ~~(Math.random() * 999999)
})

Helpers.__defineGetter__('testImageTargetPath', function() {
  return process.cwd() + "/test/tmp/test" + Helpers.random +".gif"
})

Helpers.__defineGetter__('testImagePath', function() {
  return process.cwd() + "/test/assets/test.gif"
})