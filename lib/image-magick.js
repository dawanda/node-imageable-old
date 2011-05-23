var exec = require('child_process').exec

var rand = function(number){
  return parseInt(Math.random() * number);
}

var ImageMagic = module.exports = {
  convert: function(action, url, geometry, callback){
    var temp = [__dirname, '..', "tmp", rand(99999999).toString()].join('/')

    if(action == 'resize'){
      var command = ["convert -resize", geometry, url, temp].join(" ")
    } else if(action == 'fit'){
      var command = ["convert -gravity center -resize", geometry+'^', "-gravity center -extent", geometry, url, temp].join(" ")
    } else if(action == 'crop'){

    } else {
      // FOOO
    }

    console.log(command)
    exec(command, function (err, stdout, stderr) {
      callback(err, temp)
    });
  }
}
