var path = require('path')
var memdb = require('memdb')
var Hyperdrive = require('hyperdrive')
var Swarm = require('hyperdrive-archive-swarm')
var raf = require('random-access-file')
var each = require('stream-each')

var link = process.argv[2]

var db = memdb()
var drive = Hyperdrive(db)
var archive = drive.createArchive(link, {
  file: function (name) {
    return raf(path.join('download', name)) // We will download into a "download" dir
  }
})
var swarm = Swarm(archive)

each(archive.list({live: false}), function (data, next) {
  archive.download(data, function (err) {
    if (err) return console.error(err)
    console.log('downloaded', data.name)
    next()
  })
}, function () {
  process.exit(0)
})