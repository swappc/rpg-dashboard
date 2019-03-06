class Midi {

    setDB(db) {
        this.db = db;
    }

    setupRoutes (app) {
        app.get('/api/midi', (request, response) => {
            this.db.all('SELECT * FROM controller_buttons', [], (err, rows) => {
                response.status(200).json(rows);
            });
        })
    }

    dbinit (db) {
        this.setDB(db);
        db.run('CREATE TABLE IF NOT EXISTS controller_buttons (page INTEGER NOT NULL, row INTEGER NOT NULL, column INTEGER NOT NULL, type TEXT NOT NULL, data BLOB)');
    }

}

module.exports = Midi;