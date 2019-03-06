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
const AppDB = require('./db/app-db.js')
const appDB = new AppDB();

const Midi = require('./scripts/midi/midi.js');
const Crate = require('./scripts/crate/crate.js');
const Open5e = require('./scripts/open5e/open5e.js');
const midi = new Midi();
const crate = new Crate();
const open5e = new Open5e();

let serverRoot = args['serverRoot'] ? args['serverRoot'] : './server';
if (args['dbinit']) {
  appDB.initDB(fs, serverRoot, sqlite3, db => {
    midi.dbinit(db);
    crate.dbinit(db, fs, serverRoot, args, path);
    open5e.initDB(db);
  });
} else {
  var db = appDB.getDB();
  midi.setDB(db);
  crate.setDB(db);
  open5e.setDB(db);
}

midi.setupRoutes(app);
crate.setupRoutes(app, express);

let clientRoot = args['clientRoot'] ? args['clientRoot'] : '../client';

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use('/', express.static("./client-angular/dist/client-angular/"))

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

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

process.on('exit', () => {
  crate.onClose();
  midi.onClose();
});

