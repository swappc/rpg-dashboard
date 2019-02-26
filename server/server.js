const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
const port = 3000
const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');
var path = require('path');
const args = require('minimist')(process.argv.slice(2))

let serverRoot = args['serverRoot'] ? args['serverRoot'] : './server';

let db = new sqlite3.Database(serverRoot + '/db/playlists.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to playlists db');
});

if (args['dbinit']) {
  function processDirectory(directory, urlPath) {

    var listings = fs.readdirSync(directory);
    listings.forEach((obj) => {
      var fsStats = fs.statSync(directory + '/' + obj);
      if (fsStats.isFile()) {
        var fileName = path.parse(obj).base;
        db.run('INSERT INTO library_tracks(trackName, trackFile) VALUES (?,?) ON CONFLICT(trackName) DO NOTHING', [fileName, urlPath + '/' + obj]);
      } else if (fsStats.isDirectory()) {
        processDirectory(directory + '/' + obj, urlPath + "/" + obj);
      }
    })
  }

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')
      .run('CREATE TABLE IF NOT EXISTS playlist_tracks (trackId INTEGER NOT NULL, playlistId INTEGER NOT NULL, PRIMARY KEY (trackId, playlistId))')
      .run('CREATE TABLE IF NOT EXISTS library (folder TEXT UNIQUE NOT NULL)')
      .run('CREATE TABLE IF NOT EXISTS library_tracks(trackName TEXT UNIQUE NOT NULL, trackFile TEXT NOT NULL)');

    var libraryPath = args['library'] ? args['library'] : serverRoot + '/assets';


    db.run('DELETE FROM library')
      .run("INSERT INTO library(folder) VALUES (?)", [libraryPath]);

    db.all('SELECT rowid, folder FROM library', [], (err, rows) => {
      db.run('DELETE FROM library_tracks');
      rows.forEach((row) => {
        processDirectory(row.folder, '/assets/library' + row.rowid);
      })
      fs.readFile(serverRoot + '/playlists.json', 'utf8', function (err, contents) {
        db.run('DELETE FROM playlists');
        db.run('DELETE FROM playlist_tracks');
        JSON.parse(contents).forEach((playlist, index) => {
          db.run('INSERT INTO playlists(id, name) VALUES (?,?)', [index, playlist.name]);
          var playlistFiles = playlist.files.map((track) => track.name);
          var placeholders = '(' + playlist.files.map(() => '?').join(',') + ')';

          db.all('SELECT rowid FROM library_tracks WHERE trackName in ' + placeholders, playlistFiles, (err, rows) => {
            if (rows && rows.length > 0) {
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
    });


  })
}

let clientRoot = args['clientRoot'] ? args['clientRoot'] : '../client';

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

if (args['angular']) {
  app.use('/', express.static("./client-angular/dist/client-angular/"))
  db.all('SELECT rowid, folder FROM library', [], (err, rows) => {
    rows.forEach((row) => {
      if (row.folder) {
        app.use('/assets/library' + row.rowid, express.static(row.folder))
      }
    })

  })


  app.use('/index.html', express.static("./client-angular/dist/client-angular/index.html"))

  app.use(function (req, res, next) {
    var url = require("url");
    var result = url.parse(req.url);
    if (!result.path.startsWith("/api") && !result.path.startsWith("/assets")) {
      res.sendfile('./client-angular/dist/client-angular/')
    }
    else {
      next();
    }
  });


} else {
  app.use('/scripts', express.static(clientRoot + "/public/scripts"))
  app.use('/public/music', express.static(clientRoot + "/public/music"))

  app.use('/index.html', express.static(clientRoot + "/public/index.html"))

}




app.get('/api/playlists', (request, response) => {

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

app.get('/api/library', (request, response) => {
  db.all(
    "SELECT lt.trackName as name, lt.trackFile as file \
  FROM library_tracks lt \
  order by lt.trackName", [], (err, rows) => {
      response.json(200, rows);
    })
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

process.on('exit', () => { db.close(); });

