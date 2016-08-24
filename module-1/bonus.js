// RUN:
// node bonus.js <dat-link> <filename>

var memdb = require('memdb')
var Hyperdrive = require('hyperdrive')
var Swarm = require('hyperdrive-archive-swarm')

var link = process.argv[2] // user enters link as second argument
var file = process.argv[3] // test file as third argument

if (!link || !file) {
  console.error('Link and File required.')
  process.exit(1)
}

var db = memdb()
var drive = Hyperdrive(db)
var archive = drive.createArchive(link)
var swarm = Swarm(archive)

var stream = archive.createFileReadStream(file)

stream.on('end', function (err) {
  process.exit(0)
})
stream.on('error', function (err) {
  console.error('File does not exist.')
  process.exit(1)
})
stream.pipe(process.stdout)
