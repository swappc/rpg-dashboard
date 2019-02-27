const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
const port = 3000
const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
    db.run('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, name TEXT NOT NULL, priority INTEGER UNIQUE)')
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

app.post('/api/playlists', (request, response) => {

  var name = request.body.name;
  db.run('INSERT INTO playlists(name) VALUES (?)', [name], (err, row) => {
    db.get("SELECT last_insert_rowid() as 'id' FROM playlists", [], (err, row) => {
      var playlist = {};
      playlist.name = name;
      playlist.id = row.id;
      playlist.files = [];

      response.status(201).json(playlist);
    });
  });

});

app.delete('/api/playlists/:playlistId', (request, response) => {
  var playlistId = request.param('playlistId');

  db.get('SELECT id, name, priority FROM playlists WHERE id = ?', [playlistId], (err, row) => {
    if (err) {
      response.status(500).json(err);
      return;
    }

    if (!row) {
      response.status(404).json("Not Found");
      return;
    }

    var returnRes = row;
    db.run('DELETE FROM playlists WHERE id = ?', [playlistId], (err, row) => {
      if (err) {
        response.status(500).json(err);
        return;
      }

      db.run('DELETE FROM playlist_tracks WHERE playlistId = ?', [playlistId], (err, row) => {
        if (err) {
          response.status(500).json(err);
          return;
        }


        response.status(200).json(returnRes);

      });
    });
  });

});

app.patch('/api/playlists/:playlistId', (request, response) => {
  var playlistId = request.param('playlistId');
  var name = request.body.name;
  var priority = request.body.priority;
  var sql = '';
  var values = [];
  if (name) {
    sql += ' name = ? ';
    values.push(name);
  }
  if (priority && priority > 0) {
    sql += (sql.length > 0 ? ',' : '') + ' priority = ? ';
    values.push(priority);
  }

  if (sql.length > 0 && values.length > 0) {
    values.push(playlistId);
    db.run('UPDATE playlists SET ' + sql + 'WHERE id = ?', values, (result, err) => {
      if (err) {
        response.status(500).json(err);
        return;
      }

      response.status(200).json(request.body);

    });
  }
});

app.get('/api/playlists', (request, response) => {

  db.all(
    "SELECT p.name, \
            p.id, \
            p.priority \
  FROM playlists p \
  order by p.name", [], (err, rows) => {

      if (err) {
        response.status(500).json(err);
        return;
      }

      var retVal = [];
      rows.forEach((row) => {
        var playlist = {};
        playlist.name = row.name;
        playlist.id = row.id;
        playlist.priority = row.priority;
        retVal.push(playlist);
      })

      response.status(200).json(retVal);

    })
});

app.get('/api/playlists/:playlistId/tracks', (request, response) => {
  var playlistId = request.param('playlistId');
  if (playlistId) {
    db.all(
      "SELECT lt.trackName, \
              lt.trackFile \
    FROM playlist_tracks pt \
    JOIN library_tracks lt ON lt.rowid = pt.trackId \
    WHERE pt.playlistId = ? \
    order by lt.trackName", [playlistId], (err, rows) => {

        if (err) {
          response.status(500).json(err);
          return;
        }

        var retVal = [];
        rows.forEach((row) => {
          var track = {};
          track.name = row.trackName;
          track.file = row.trackFile;
          retVal.push(track);
        })

        response.status(200).json(retVal);

      })
  }


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

