const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');
var path = require('path');
const args = require('minimist')(process.argv.slice(2))

let db = new sqlite3.Database('./server/db/playlists.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to playlists db');
});

if (args['dbinit']) {
  function processDirectory(directory) {

    var listings = fs.readdirSync(directory);
    listings.forEach((obj) => {
      var fsStats = fs.statSync(directory + '/' + obj);
      if (fsStats.isFile()) {
        var fileName = path.parse(obj).base;
        db.run('INSERT INTO library_tracks(trackName, trackFile) VALUES (?,?)', [fileName, directory + '/' + obj]);
      } else if (fsStats.isDirectory()) {
        processDirectory(directory + '/' + obj);
      }
    })
  }

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')
      .run('CREATE TABLE IF NOT EXISTS playlist_tracks (trackId INTEGER NOT NULL, playlistId INTEGER NOT NULL)')
      .run('CREATE TABLE IF NOT EXISTS library (folder TEXT NOT NULL)')
      .run('CREATE TABLE IF NOT EXISTS library_tracks(trackName TEXT NOT NULL, trackFile TEXT NOT NULL)');



    if (args['library']) {
      db.run('DELETE FROM library')
        .run("INSERT INTO library(folder) VALUES (?)", [args['library']]);
    }

    db.all('SELECT * FROM library', [], (err, rows) => {
      rows.forEach((row) => {
        processDirectory(row.folder);
      })
    });

    db.get('SELECT * FROM playlist_tracks', [], (err, row) => {
      if (!row) {
        db.run('DELETE FROM playlists');
        fs.readFile('playlists.json', 'utf8', function (err, contents) {
          JSON.parse(contents).forEach((playlist, index) => {
            db.run('INSERT INTO playlists(id, name) VALUES (?,?)', [index, playlist.name]);
            var playlistFiles = playlist.files.map((track) => track.name);
            var placeholders = '(' + playlist.files.map(() => '?').join(',') + ')';

            db.all('SELECT rowid FROM library_tracks WHERE trackName in ' + placeholders, playlistFiles, (err, rows) => {
              if (rows) {
                var insertValues = [];
                rows.forEach((row) => {
                  insertValues.push(index);
                  insertValues.push(row.rowid);
                })
                var insertPlaceholders = rows.map(() => '(?,?)').join(',');
                db.run('INSERT INTO playlist_tracks(playlistId, trackId) VALUES ' + insertPlaceholders, insertValues);
              }
            })
          });
        });
      }
    })
  })
}


let clientRoot = args['clientRoot']?args['clientRoot']:'../client';

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use('/scripts', express.static(clientRoot+"/public/scripts"))
app.use('/public/music', express.static(clientRoot+"/public/music"))

app.use('/index.html', express.static(clientRoot+"/public/index.html"))

app.get('/playlists', (request, response) => {

  db.all(
    "SELECT p.name, lt.trackName, lt.trackFile \
  FROM playlist_tracks pt \
  JOIN playlists p on p.id=pt.playlistId \
  JOIN library_tracks lt ON lt.rowid = pt.trackId \
  order by p.name", [], (err, rows) => {

      var retVal = {};
      rows.forEach((row) => {
        var playlist = retVal[row.name];
        if (!playlist) {
          playlist = {};
          retVal[row.name] = playlist;
          playlist.name = row.name;
          playlist.files = [];
        }
        var track = {};
        track.name = row.trackName;
        track.file = row.trackFile;
        playlist.files.push(track);
      })
      var realRetVal = [];
      for (var list in retVal) {
        realRetVal.push(retVal[list]);
      }


      response.status(200).json(realRetVal);

    })
});

<<<<<<< HEAD:server/server.js
app.get('/library', (request, response)=>{
  db.all("SELECT * FROM library_tracks",[], (err, rows)=>{
    response.status(200).json(rows);
  })
})
=======
app.get('/library', (request, response) => {
  db.all(
    "SELECT lt.trackName as name, lt.trackFile as file \
  FROM library_tracks lt \
  order by lt.trackName", [], (err, rows) => {
      response.json(200, rows);
    })
});
>>>>>>> 6d1b241d89e2d1edf467965d130a952a44956173:server.js


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

process.on('exit', () => { db.close(); });

