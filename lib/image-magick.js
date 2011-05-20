var exec = require('child_process').exec

var rand = function(number){
  return parseInt(Math.random() * number);
}

var ImageMagic = module.exports = {
  resize: function(url, geometry, callback) {
    var temp = [__dirname, '..', "tmp", rand(99999999).toString()].join('/')
    var command = ["convert -strip -resize", geometry, url, temp].join(" ")
    console.log(command)
    exec(command, function (err, stdout, stderr) {
      callback(err, temp)
    });
  }
}
