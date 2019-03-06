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
var midi = require('./midi')();
var crate = require('./crate')();

let serverRoot = args['serverRoot'] ? args['serverRoot'] : './server';
if (args['dbinit']) {
  midi.dbinit(sqlite3, fs, serverRoot);
  crate.dbinit(sqlite3, fs, serverRoot, args, path);
}

midi.setupRoutes(app, sqlite3, serverRoot);
crate.setupRoutes(app, sqlite3, express, serverRoot);

let clientRoot = args['clientRoot'] ? args['clientRoot'] : '../client';

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use('/', express.static("./client/dist/client/"))

app.use('/index.html', express.static("./client/dist/client/index.html"))

app.use(function (req, res, next) {
  var url = require("url");
  var result = url.parse(req.url);
  if (!result.path.startsWith("/api") && !result.path.startsWith("/assets")) {
    res.sendfile('./client/dist/client/')
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

process.on('exit', () => { crate.onClose();
midi.onClose(); });

