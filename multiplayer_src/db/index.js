// initialize and export nedb
const Datastore = require("nedb");
const db = new Datastore("database.db");
db.loadDatabase();

// Export nedb
module.exports = db;
