
class AppDB {

    constructor() {
        this.dbFile = '/db/rpg-dasboard.db';
    }


    initDB(fs, serverRoot, sqlite3, serializedCallback) {
        fs.unlink(serverRoot + this.dbFile, (err) => {
            if (err) {
                console.log('Unable to delete existing database.');
                console.log(err);
            } else {
                console.log('Existing database deleted');
                this.db = null;
            }
        })
        if (!this.db) {
            this.connectToDB(sqlite3, serverRoot);
        }

        this.db.serialize(() => {
            serializedCallback(this.db);
        });

        console.log('Database initialized');
    }

    getDB(serverRoot, sqlite3) {
        if (!this.db) {
            this.connectToDB(sqlite3, serverRoot);
        }
        return this.db;
    }

    connectToDB(sqlite3, serverRoot) {
        this.db = new sqlite3.Database(serverRoot + this.dbFile, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to crates db');
        });
    }

}

module.exports = AppDB;