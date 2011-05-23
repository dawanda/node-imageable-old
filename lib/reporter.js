var exec = require('child_process').exec

average = function(a){
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}

var Reporter = module.exports = {
  times: {},

  timing: function(name, duration){
    Reporter.times[name] = Reporter.times[name] || []
    Reporter.times[name].push(duration)
  },

  report: function(){
    var times = Reporter.times;
    Reporter.times = {}
    for(name in times){
      exec("statsd-send inc node-imageable " + name + '-count --by' + times[name].length)
      exec("statsd-send inc node-imageable " + name + '-mean --by' + average(times[name]))
    }
  },

  startReporting: function(){
    setInterval(Reporter.report, 1000)
  }
}
