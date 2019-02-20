const { app, BrowserWindow, ipcMain } = require('electron')

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dataurl = require('dataurl');
const converter = require('electron-audio-conversion');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

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


ipcMain.on('load-playlist', (event, arg) => {

  db.all('SELECT * FROM playlist_tracks pt JOIN playlists p on p.id=pt.playlistId order by p.name', [], (err, rows) => {

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
    event.returnValue = realRetVal;

  })
})

ipcMain.on('load-track',(event,args)=>{
  converter.createSongUri(args,'audio/mp3').then((value)=>{

    event.returnValue = value;
  })
})




