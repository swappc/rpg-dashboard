var https = require('https');

class Open5eAPI {

  getBackgrounds(callback) {
    this.getAll("backgrounds", callback);
  }

  getClasses(callback) {
    this.getAll("classes", callback);
  }

  getConditions(callback) {
    this.getAll("conditions", callback);
  }

  getFeats(callback) {
    this.getAll("feats", callback);
  }

  getMagicItems(callback) {
    this.getAll("magicitems", callback);
  }

  getMonsters(callback) {
    this.getAll("monsters", callback);
  }

  getPlanes(callback) {
    this.getAll("planes", callback);
  }

  getRaces(callback) {
    this.getAll("races", callback);
  }

  getSpells(callback) {
    this.getAll("spells", callback);
  }


  getOpen5eApi(route, page, callback) {
    var options = {
      host: 'api-beta.open5e.com',
      port: 443,
      path: '/' + route + '/?format=json' + (page ? '&page=' + page : ''),
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    };
    var buffer = "",
        data;

    var req = https.request(options, function(res) {
      
      res.on('data', function(chunk) {
        buffer += chunk;
      });

      res.on('end', function (err) {

        if (err) {
          console.log(err);
          return;
        }

        data = JSON.parse(buffer);
        callback(data);
      });
    });
    req.end();

    req.on('error', function(e) {
      console.error(e);
    });
  }

  getAll(route, callback) {
    var results = [];
    this.getAllWithPage(results, null, route, callback);
  }

  getAllWithPage(results, page, route, callback) {

    this.getOpen5eApi(route, page, (jsonData) => {
      if (!jsonData) {
        callback(results);
        return;
      }
      results = results.concat(jsonData.results);
      if (!jsonData.next) {
        callback(results);
        return;
      }

      var page = jsonData.next.split(/.*=/)[1];
      this.getAllWithPage(results, page, route, callback);
    })
  }
}

module.exports = Open5eAPI;
