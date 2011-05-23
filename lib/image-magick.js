var exec = require('child_process').exec

var rand = function(number){
  return parseInt(Math.random() * number);
}

var ImageMagic = module.exports = {
  convert: function(action, url, params, callback){
    var temp = [__dirname, '..', "tmp", rand(99999999).toString()].join('/')

    if(action == 'resize'){
      var command = ["convert -resize", params['size'], url, temp].join(" ")
    } else if(action == 'fit'){
      var command = ["convert -gravity center -resize", params['size']+'^', "-gravity center -extent", params['size'], url, temp].join(" ")
    } else if(action == 'crop'){
      var command = ["convert -crop", params['crop'], url, temp].join(" ")
    } else {
      // FOOO
    }

    console.log(command)
    exec(command, function (err, stdout, stderr) {
      callback(err, temp)
    });
  }
}
