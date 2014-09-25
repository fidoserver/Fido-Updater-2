var exec = require('child_process').exec;
var cmd = ''

module.exports = function(callback) {
  console.log('running script 0.0.1.js')
  cmd += 'cd /root/Fido-Updater/scripts; '
  cmd += 'chmod +x 0.0.1.sh; '
  cmd += './0.0.1.sh; '
  exec(cmd, function(error, stdout, stderr) {
    console.log(error)
    console.log(stdout)
    console.log(stderr)
    callback()
  })
}
