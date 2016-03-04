var Hyperdrive = require('hyperdrive')
var Level = require('level')
var Swarm = require('discovery-swarm')
var swarmDefaults = require('datland-swarm-defaults')

var fs = require('fs')

var link = new Buffer(process.argv[2], 'hex')

var db = Level('./dat.db')
var drive = Hyperdrive(db)
var config = swarmDefaults({
  // use the Dat default dns + discovery servers
  stream: function () {
    return drive.createPeerStream()
  }
})
var swarm = Swarm(config)

swarm.once('listening', function () {
  swarm.join(link) // Join swarm for given link
  var archive = drive.get(link, process.cwd()) // download to current path
  archive.ready(function (err) {
    // a stream of all metadata. needs to download once then will cache
    var metadata = archive.createEntryStream()
    // start downloading all entries
    metadata.on('data', function (entry) {
      console.log(entry)
    })
    metadata.on('end', function () {
      process.exit(0)
    })
  })
})

swarm.listen(3282) // Listen on 3282, default Dat port