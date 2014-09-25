var fs = require('fs')
var log = require('./lib/log.js')
var Backbone = require('backbone')
var _ = require('underscore')
var express = require('express')
var server = express()
var getAvailableUpdates = require('./lib/GetAvailableUpdates.js')

server.get('/get-available-updates', function(req, res) {
  getAvailableUpdates(function(err, updates) {
    if (err) return log('GetAvailableUpdates', err)
    res.send(JSON.stringify(updates))
  })
})

server.get('/run-available-updates', function(req, res) {

  var availableUpdates

  var a = function() {
    getAvailableUpdates(function(err, results){
      if (err) return log('GetAvailableUpdates', err)
      if (results.length == 0) return res.send('Nothing to do')
      availableUpdates = results
      b()
    })
  }

  // Compile a list of availableUpdates's, require them in, and run them sequentially
  var b = function() {
    if (availableUpdates.length < 1) {
      // nothing availableUpdates
      return
    }
    else {
      var i = 0
      // recursively run updates 
      function process(callback) {
        if(i == availableUpdates.length) {
          // we're all done
          c()
        }
        else {
          var update = require(__dirname + '/scripts/' + availableUpdates[i].script)
          update(function() {
            i++
            process()
          })
        }
      }
      process()
    }           
  }
  
  // Write out what we've done into the history file
  var c = function() {
    var updates = JSON.parse(fs.readFileSync(__dirname + "/updates.json", 'utf8'))
    fs.writeFile(__dirname + "/history.json",JSON.stringify(_.keys(updates)), function(err) {
      console.log('done \n') 
      res.send('ok')
    })
  }

  a()

})

server.listen(5024);
console.log('Fido-Updater listening on port 5024')
