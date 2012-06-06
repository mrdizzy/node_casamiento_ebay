var views = require('./design_schema'),
    db = require('./database');

rebuildDatabase(function() {
    for (var key in views) {
        var map_functions = views[key];
        db.save('_design/' + key, map_functions, function(err, res) {
            if (err) {
                console.log(err);
            }
            else {
                addFixtures();
            }
        });
    };
});

var customers = [{
    name: "David Pettifer",
    emails: ["david.p@dizzy.co.uk", "david.p@casamiento.co.uk"],
    EIASToken: "tokendavid",
    type: "customer",
    UserIDs: ["casamiento"]
},
{
    
    name: "Gary Cooley", 
    type: "customer",
    emails: ["rebelcoo7@hotmail.com"],
    EIASToken: "rebelcoo",
    UserIDs: ["rebelcoo7"]
}];

function addFixtures() {

    db.save(customers, function(err, res) {
        console.log(err, res)
    })
}



var cb = function(err, res) {
        console.log(err, res);
    }


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
        if (err) {
            throw ("Could not destroy database" + err);
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