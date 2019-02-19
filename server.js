const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');



let db = new sqlite3.Database('./db/playlists.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to playlists db');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')
    .run('CREATE TABLE IF NOT EXISTS playlist_tracks (trackName TEXT NOT NULL, trackFile TEXT NOT NULL, playlistId INTEGER NOT NULL)');

  db.get('SELECT * FROM playlist_tracks', [], (err, row) => {
    if (!row) {
      fs.readFile('playlists.json', 'utf8', function (err, contents) {
        JSON.parse(contents).forEach((element, index) => {
          db.run('INSERT INTO playlists(id, name) VALUES (?,?)', [index, element.name]);
          var placeholders = element.files.map((element) => '(?,?,?)').join(',');
          var values = [];
          element.files.forEach((element) => {
            values.push(element.name);
            values.push(element.file);
            values.push(index);
          })
          db.run('INSERT INTO playlist_tracks(trackName, trackFile,playlistId) VALUES ' + placeholders, values);

        });
      });
    }
  })

})



app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use('/scripts', express.static("public/scripts"))
app.use('/music', express.static("public/music"))

app.use('/index.html', express.static("public/index.html"))

app.get('/playlists', (request, response) => {

  db.all('SELECT * FROM playlist_tracks pt JOIN playlists p on p.id=pt.playlistId order by p.name', [], (err, rows) => {

    var retVal = {};
    rows.forEach((row)=>{
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
    var realRetVal=[];
    for(var list in retVal){
      realRetVal.push(retVal[list]);
    }


    response.json(200,realRetVal);

  })
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

process.on('exit', () => { db.close(); });

