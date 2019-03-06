class Midi {

    setDB(db) {
        this.db = db;
    }

    setupRoutes (app) {
        app.get('/api/controllers', (request, response) => {
            this.db.all('SELECT * FROM controllers', [], (err, rows) => {
                response.status(200).json(rows);
            });
        })

        app.post('/api/controllers', (request, response)=>{
            var name = request.body.name;
            var hardwareName = request.body.hardwareName;
            this.db.run('INSERT INTO controllers (name, hardwareName) VALUES (?,?)',[name, hardwareName],(err,rows)=>{
                this.db.get("SELECT last_insert_rowid() as 'id' FROM controllers", [], (err, row) => {
                    var controller = {};
                    controller.name = name;
                    controller.id= row.id;
                    controller.hardwareName = hardwareName;
    
                    response.status(201).json(controller);
                })

            })
        });

        app.get('/api/controllers/:controllerId/keys', (request, response) => {
            this.db.all('SELECT * FROM controller_keys WHERE controllerId=?', [request.param('controllerId')], (err, rows) => {
                response.status(200).json(rows);
            });
        })
    }

    dbinit (db) {
        this.setDB(db);
        db.run('CREATE TABLE IF NOT EXISTS controllers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, hardwareName TEXT NOT NULL)')
        .run('CREATE TABLE IF NOT EXISTS controller_keys (controllerId INTEGER NOT NULL, page INTEGER NOT NULL, row INTEGER NOT NULL, column INTEGER NOT NULL, type TEXT NOT NULL, data BLOB, PRIMARY KEY(controllerId, page, row, column))');
    }

}

module.exports = Midi;