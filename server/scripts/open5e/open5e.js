const Open5eAPI = require('../../external-api/open5eApi.js');
const open5e = new Open5eAPI();
const Open5DB = require('./open5e-db.js')

class Open5e {

  initDB(db) {
    this.setDB(db);
    console.log(db);
    this.odb.createTables();
    //open5e.getClasses(classes => this.odb.populateClasses(classes));
  }

  setDB(db) {
    this.odb = new Open5DB(db);
  }

}

module.exports = Open5e;