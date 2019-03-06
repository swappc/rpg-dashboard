module.exports = function () {
    var dbFile = '/db/crates.db';

    var crate = {};

    crate.setupRoutes = function (app, sqlite3, express, serverRoot) {
        if (!this.db) {
            this.connectToDB(sqlite3, serverRoot);
        }

        app.post('/api/crates', (request, response) => {

            var name = request.body.name;
            var type = request.body.type;
            var metadata = request.body.metadata ? request.body.metadata : {};
            crate.db.run('INSERT INTO crates(name, type, metadata) VALUES (?, ?, ?)', [name, type, JSON.stringify(metadata)], (err, row) => {
                crate.db.get("SELECT last_insert_rowid() as 'id' FROM crates", [], (err, row) => {
                    var crate = {};
                    crate.name = name;
                    crate.id = row.id;
                    crate.type = type;
                    crate.metadata = metadata;
                    crate.files = [];

                    response.status(201).json(crate);
                });
            });

        });

        app.delete('/api/crates/:crateId', (request, response) => {
            var crateId = request.param('crateId');

            crate.db.get('SELECT id, name FROM crates WHERE id = ?', [crateId], (err, row) => {
                if (err) {
                    response.status(500).json(err);
                    return;
                }

                if (!row) {
                    response.status(404).json("Not Found");
                    return;
                }

                var returnRes = row;
                crate.db.run('DELETE FROM crates WHERE id = ?', [crateId], (err, row) => {
                    if (err) {
                        response.status(500).json(err);
                        return;
                    }

                    crate.db.run('DELETE FROM crate_tracks WHERE crateId = ?', [crateId], (err, row) => {
                        if (err) {
                            response.status(500).json(err);
                            return;
                        }


                        response.status(200).json(returnRes);

                    });
                });
            });

        });

        app.patch('/api/crate/:crateId', (request, response) => {
            var crateId = request.param('crateId');
            var name = request.body.name;
            var type = request.body.type;
            var metadata = request.body.metadata;
            var values = [];
            var updates = [];
            if (name) {
                updates.push(' name = ? ');
                values.push(name);
            }
            if (type && type > 0) {
                updates.push(' type = ? ');
                values.push(type);
            }

            if (metadata && metadata > 0) {
                updates.push(' metadata = ? ');
                values.push(JSON.stringify(metadata));
            }

            if (sql.length > 0 && values.length > 0) {
                values.push(crateId);
                crate.db.run('UPDATE crates SET ' + updates.join(',') + 'WHERE id = ?', values, (err, row) => {
                    if (err) {
                        response.status(500).json(err);
                        return;
                    }

                    response.status(200).json(request.body);

                });
            }
        });

        app.put('/api/crates/:crateId/tracks', (request, response) => {
            var crateId = request.param('crateId');
            var tracks = request.body;

            crate.db.run('DELETE FROM crate_tracks WHERE crateId = ?', [crateId], (err, row) => {
                if (err) {
                    console.log(err);
                    response.status(500).json(err);
                    return;
                }

                var insertValues = [];
                tracks.forEach((track) => {
                    insertValues.push(crateId);
                    insertValues.push(track.id);
                })
                var insertPlaceholders = tracks.map(() => '(?,?)').join(',');
                crate.db.run('INSERT INTO crate_tracks(crateId, trackId) VALUES ' + insertPlaceholders, insertValues);
            });
        })

        app.get('/api/crates', (request, response) => {

            crate.db.all(
                "SELECT p.name, \
              p.id, \
              p.type, \
              p.metadata \
    FROM crates p \
    order by p.name", [], (err, rows) => {

                    if (err) {
                        response.status(500).json(err);
                        return;
                    }

                    var retVal = [];
                    rows.forEach((row) => {
                        var crate = {};
                        crate.name = row.name;
                        crate.id = row.id;
                        crate.type = row.type;
                        crate.metadata = JSON.parse(row.metadata);
                        retVal.push(crate);
                    })

                    response.status(200).json(retVal);

                })
        });

        app.get('/api/crates/:crateId/tracks', (request, response) => {
            var crateId = request.param('crateId');
            if (crateId) {
                crate.db.all(
                    "SELECT lt.trackName, \
                lt.trackFile, \
                lt.rowid \
      FROM crate_tracks pt \
      JOIN library_tracks lt ON lt.rowid = pt.trackId \
      WHERE pt.crateId = ? \
      order by lt.trackName", [crateId], (err, rows) => {

                        if (err) {
                            response.status(500).json(err);
                            return;
                        }

                        var retVal = [];
                        rows.forEach((row) => {
                            var track = {};
                            track.name = row.trackName;
                            track.file = row.trackFile;
                            track.id = row.id;
                            retVal.push(track);
                        })

                        response.status(200).json(retVal);

                    })
            }


        });

        app.get('/api/library', (request, response) => {
            crate.db.all(
                "SELECT lt.trackName as name, lt.trackFile as file, lt.rowid as id \
    FROM library_tracks lt \
    order by lt.trackName", [], (err, rows) => {
                    response.json(200, rows);
                })
        });

        crate.db.all('SELECT rowid, folder FROM library', [], (err, rows) => {
            rows.forEach((row) => {
                if (row.folder) {
                    app.use('/assets/library' + row.rowid, express.static(row.folder))
                }
            })

        })

    }

    crate.connectToDB = function (sqlite3, serverRoot) {
        crate.db = new sqlite3.Database(serverRoot + dbFile, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to crates db');
        });
    }

    crate.dbinit = function (sqlite3, fs, serverRoot, args, path) {
        fs.unlink(serverRoot + dbFile, (err) => {
            if (err) {
                console.log('Unable to delete existing database.');
                console.log(err);
            } else {
                console.log('Existing database deleted');
            }
        })
        if (!this.db) {
            this.connectToDB(sqlite3, serverRoot);
        }

        crate.db.serialize(() => {
            function processDirectory(directory, urlPath) {
        
              var listings = fs.readdirSync(directory);
              listings.forEach((obj) => {
                var fsStats = fs.statSync(directory + '/' + obj);
                if (fsStats.isFile()) {
                  var fileName = path.parse(obj).base;
                  crate.db.run('INSERT INTO library_tracks(trackName, trackFile) VALUES (?,?) ON CONFLICT(trackName) DO NOTHING', [fileName, urlPath + '/' + obj]);
                } else if (fsStats.isDirectory()) {
                  processDirectory(directory + '/' + obj, urlPath + "/" + obj);
                }
              })
            }
        
            crate.db.run('CREATE TABLE IF NOT EXISTS crates (id INTEGER PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, metadata BLOB)')
              .run('CREATE TABLE IF NOT EXISTS crate_tracks (trackId INTEGER NOT NULL, crateId INTEGER NOT NULL, PRIMARY KEY (trackId, crateId))')
              .run('CREATE TABLE IF NOT EXISTS library (folder TEXT UNIQUE NOT NULL)')
              .run('CREATE TABLE IF NOT EXISTS library_tracks(id INTEGER PRIMARY KEY, trackName TEXT UNIQUE NOT NULL, trackFile TEXT NOT NULL)');
        
            var libraryPath = args['library'] ? args['library'] : serverRoot + '/assets';
        
        
            crate.db.run('DELETE FROM library')
              .run("INSERT INTO library(folder) VALUES (?)", [libraryPath]);
        
            crate.db.all('SELECT rowid, folder FROM library', [], (err, rows) => {
              crate.db.run('DELETE FROM library_tracks');
              rows.forEach((row) => {
                processDirectory(row.folder, '/assets/library' + row.rowid);
              })
              fs.readFile(serverRoot + '/playlists.json', 'utf8', function (err, contents) {
                crate.db.run('DELETE FROM crates');
                crate.db.run('DELETE FROM crate_tracks');
                JSON.parse(contents).forEach((playlist, index) => {
                  crate.db.run('INSERT INTO crates(id, name, type, metadata) VALUES (?,?, "PLAYLIST", ?)', [index, playlist.name, JSON.stringify({ priority: index })]);
                  var playlistFiles = playlist.files.map((track) => track.name);
                  var placeholders = '(' + playlist.files.map(() => '?').join(',') + ')';
        
                  crate.db.all('SELECT id FROM library_tracks WHERE trackName in ' + placeholders, playlistFiles, (err, rows) => {
                    if (rows && rows.length > 0) {
                      var insertValues = [];
                      rows.forEach((row) => {
                        insertValues.push(index);
                        insertValues.push(row.id);
                      })
                      var insertPlaceholders = rows.map(() => '(?,?)').join(',');
                      crate.db.run('INSERT INTO crate_tracks(crateId, trackId) VALUES ' + insertPlaceholders, insertValues);
                    }
                  })
                });
              });
            });
            console.log('Database initialized');
        
        
          })

    }

    crate.onClose = function () {
        crate.db.close()
    }



    return crate;


}