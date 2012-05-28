var cradle = require('cradle'),
db = new(cradle.Connection)('https://casamiento.iriscouch.com', 443, {
    auth: {
        username: "casamiento",
        password: "floppsy1"
    }
}).database("test_ebay");

module.exports = db;