const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/playlists.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to playlists db');
});

db.run('CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')
  .run('CREATE TABLE IF NOT EXISTS playlist_tracks (id INTEGER PRIMARY KEY, name TEXT NOT NULL, file TEXT NOT NULL)');

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use(express.static("public"))


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

process.on('exit', () => { db.close(); });

