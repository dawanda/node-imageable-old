var fs     = require('fs')
  , crypto = require('crypto')
  , exec   = require("child_process").exec

var Utils = module.exports = function(configPath) {
  this.config = JSON.parse(fs.readFileSync(configPath))
}

Utils.prototype.getConfig = function() {
  return this.config
}

Utils.prototype.hash = function(s) {
  return crypto.createHash('md5').update(s + this.config.secret).digest("hex").slice(0,8)
}

Utils.prototype.hashMatches = function(hash, data){
  var doesMatch = false
  
  doesMatch = doesMatch || (this.config.magicHash == hash)
  doesMatch = doesMatch || (this.config.secret.toString().length == 0)
  doesMatch = doesMatch || (this.hash(data) == hash)
  
  return doesMatch
}

Utils.prototype.sendImage = function(err, res, path) {
  if(err) return // render 500
  res.contentType(path)
  res.sendfile(path, function(){
    exec("rm " + path)
  })
}