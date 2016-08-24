var memdb = require('memdb')
var Hyperdrive = require('hyperdrive')
var Swarm = require('hyperdrive-archive-swarm')

var link = process.argv[2] // user enters link as second argument

var db = memdb()
var drive = Hyperdrive(db)
var archive = drive.createArchive(link)
var swarm = Swarm(archive)

var stream = archive.createFileReadStream(0) // get the first file

stream.on('end', function (err) {
  process.exit(0)
})
stream.pipe(process.stdout)
