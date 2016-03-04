var Hyperdrive = require('hyperdrive')
var Level = require('level')
var Swarm = require('discovery-swarm')
var swarmDefaults = require('datland-swarm-defaults')

var walker = require('folder-walker')
var each = require('stream-each')

var db = Level('./dat.db')
var drive = Hyperdrive(db)
var config = swarmDefaults({
  // use the Dat default dns + discovery servers
  stream: function () {
    return drive.createPeerStream()
  }
})
var swarm = Swarm(config)

var linkDir = process.argv[2] || process.cwd() // Share path given or current path
var archive = drive.add(linkDir)

var fileStream = walker(linkDir)
each(fileStream, function (data, next) {
  archive.appendFile(data.filepath, data.basename, function (err) {
    if (err) throw err
    console.log('appended to archive: ', data.filepath)
    next()
  })
}, doneAppending)

function doneAppending (err) {
  if (err) return cb(err)
  archive.finalize(function (err) {
    if (err) return cb(err)
    var link = archive.id.toString('hex')
    joinTpcSwarm(link)
  })
}

function joinTpcSwarm (link) {
  swarm.once('listening', function () {
    var key = new Buffer(link, 'hex')
    swarm.join(key) // Join swarm for given link
    console.log('sharing dat link:', link)
  })

  swarm.listen(3282) // Listen on 3282, default Dat port
}