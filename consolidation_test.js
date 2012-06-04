var cradle = require('cradle'),
    db = new(cradle.Connection)('https://casamiento.iriscouch.com', 443, {
        auth: {
            username: "casamiento",
            password: "floppsy1"
        }
    }).database("casamiento");

function resetDb(cb) {
    db.destroy(function(err, res) {
        db.create(function(err, res) {
            cb(err, res);
        })
    });

}

var customers = [{
    EIASToken: "uniquetoken1",
    EmailAddresses: ["david.pettifer@dizzy.co.uk", "alice@wonderland.com", "happyhele@gmail.com"]
}, {
    EIASToken: "uniquetoken2",
    EmailAddresses: ["rebelcoo7@hotmail.com"]
}]

var incomingMessages = [{
    Text: "Alex is dying.",
    FromFull: {
        "Email": "david.pettifer@dizzy.co.uk",
        "Name": "Alex Lewis"
    }
}, {
    Text: "Hi there Simon.",
    FromFull: {
        "Email": "melinda@postoffice.co.uk",
        "Name": "Melinda Postoffice"
    }
}]

resetDb(function(err, res) {
    db.save(customers, function(err, res) {
        db.save('_design/customers', {
            email: {
                map: function(doc) {
                    if (doc.EmailAddresses) {
                        for (var i = 0; i < doc.EmailAddresses.length; i++) {
                            emit(doc.EmailAddresses[i], doc)
                        }
                    }
                }
            }
        }, function(err, res) {
            incomingMessages.forEach(function(message) {
            db.view('customers/email', { key: message.FromFull.Email }, function (err, result) {
               if(result[0]) {
                message.customer = result[0].id;
               }
                 console.log(message, result.id);
                db.save(message, function(e,r) {
                    console.log(e,r);
                });
  });
            });
        });

    });
});
