var cradle = require('cradle'),
    db = new(cradle.Connection)("https://casamiento.iriscouch.com", 443, {
        auth: {
            username: 'casamiento',
            password: 'floppsy1'
        }
    }).database('test_ebay');

var cb = function(err, res) {
    console.log(err, res);
}

var setUpTime = function() {
    db.save("time", { lastModified: "2012-05-27T15:14:28.443Z" }, cb);
}

rebuildDatabase(function() {
    setUpTime();
    setUpSecurity();
})

// Defaults to admin only allowing access to database
function setUpSecurity() {
    db.save("_security", {
        "admins": {
            "names": [],
            "roles": ["admin"]
        },
        "members": {
            "names": [],
            "roles": ["admin"]
        }
    }, cb)
}

function rebuildDatabase(callback) {
    db.destroy(function(err, res) {
        if(err) {
            throw("Could not destroy database" + err);
        }
        else {
            console.log("Destroyed database");
        }
        db.create(function(err, res) {
            console.log("Created database: ", err, res);
            callback();
        })
    })
}

function createDesign() {
    db.save('_design/orders', {
        date: {
            map: function(doc) {
                if (doc.CreatedTime) {
                    emit([doc.CreatedTime, doc.OrderID, doc.BuyerUserID], doc);
                }
            }
        }
    }, function(err, res) {
        console.log(err, res);
    });
}