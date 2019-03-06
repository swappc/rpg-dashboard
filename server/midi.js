module.exports = function () {
    var dbFile = '/db/midi.db';

    var midi = {};

    midi.setupRoutes = function (app, sqlite3, serverRoot) {
        if (!this.db) {
            this.connectToDB(sqlite3, serverRoot);
        }
        app.get('/api/midi', (request, response) => {
            db.all('SELECT * FROM controller_buttons', [], (err, rows) => {
                response.status(200).json(rows);
            });
        })
    }

    midi.connectToDB = function (sqlite3, serverRoot) {
        midi.db = new sqlite3.Database(serverRoot + dbFile, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to crates db');
        });
    }

    midi.dbinit = function (sqlite3, fs, serverRoot) {
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

        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS controller_buttons (page INTEGER NOT NULL, row INTEGER NOT NULL, column INTEGER NOT NULL, type TEXT NOT NULL, data BLOB)');
        });

    }

    midi.onClose = function(){
        midi.db.close()

    }



    return midi;


}