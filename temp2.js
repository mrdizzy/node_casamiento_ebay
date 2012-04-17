addBatch({
    'After resetting the database': {
        topic: function() {
            resetDb("2010-01-03T00:00:00.000Z", this.callback);
        },
        "add a single line item order": {
            topic: function() {
                var ob = new OrderBuilder();
                ob.buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                });
                AddOrdersToDatabase(db, ob.response, this.callback);
            },
            'then get orders from database database': {
                topic: function() {
                    db.all(this.callback);
                },
                "and order has been successfully added to database": function(error, result) {

                    assert.equal(2, result.length);
                }
            }
        }
    }
}).addBatch({
    "After resetting the database": {
        topic: function() {
            resetDb("2010-01-03T00:00:00.000Z", this.callback);
        },
        "and adding a single line item order": {
            topic: function() {
                                var ob = new OrderBuilder();
                ob.buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                });
                AddOrdersToDatabase(db, ob.response, this.callback);
            },
            "the lastModified time should have been updated": function() {
                db.get("time", function(err, res) {
                    assert.equal("2009-02-01T10:10:10.100Z", res.lastUpdated);
                });
            }
        }
    }
}).addBatch({
    "After resetting the database": {
        topic: function() {
            resetDb("2010-01-03T00:00:00.000Z", this.callback);
        },
        "and adding two single line item orders": {
            topic: function() {
                                var ob = new OrderBuilder();
                ob.buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                }).buildOrder({
                    ItemID: '123456789',
                    TransactionID: '344555666'
                });
                AddOrdersToDatabase(db, ob.response, this.callback);
            },
            'then get orders from database database': {
                topic: function() {
                    db.all(this.callback);
                },
                "and order has been successfully added to database": function(error, result) {

                    assert.equal(3, result.length);
                }
            }
        }
    }
}).addBatch({
    "After resetting the database": {
        topic: function() {
            resetDb("2010-01-03T00:00:00.000Z", this.callback);
        },
        "and adding four single line item orders": {
            topic: function() {
                 var ob = new OrderBuilder();
                ob.buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                }).buildOrder({
                    ItemID: '234534132313',
                    TransactionID: '244424444'
                }).buildOrder({
                    ItemID: '543219876543',
                    TransactionID: '777777777'
                }).buildOrder({
                    ItemID: '500000000000',
                    TransactionID: '333333333'
                });
                AddOrdersToDatabase(db, ob.response, this.callback);
            },
            "and adding two duplicate single line item orders": {
                topic: function() {
                    var ob = new OrderBuilder();
                    ob.buildOrder({
                    ItemID: '500000000000',
                    TransactionID: '333333333'
                }).buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                })
                    ob.response.OrderArray.Order[0].BuyerUserID = "garycooley1963";
                    
                    ob.response.OrderArray.Order[1].BuyerUserID = "shirleypettifer3";
                    AddOrdersToDatabase(db, ob.response, this.callback);
                },
                'then get orders from database': {
                    topic: function() {
                        db.all(this.callback);
                    },
                    'should be updated': function(err, res) {
                        console.log(res);
                    }

                }
            }
        }
    }
}).addBatch({
    "After resetting the database": {
        topic: function() {
            resetDb("2010-01-03T00:00:00.000Z", this.callback);
        },
        "and adding four single line item orders": {
            topic: function() {
                 var ob = new OrderBuilder();
                ob.buildOrder({
                    ItemID: '110099445588',
                    TransactionID: '999888777'
                }).buildOrder({
                    ItemID: '234534132313',
                    TransactionID: '244424444'
                }).buildOrder({
                    ItemID: '543219876543',
                    TransactionID: '777777777'
                }).buildOrder({
                    ItemID: '500000000000',
                    TransactionID: '333333333'
                });
                AddOrdersToDatabase(db, ob.response, this.callback);
            },
            "and adding one duplicate combined order": {
                topic: function() {
                    var ob = new OrderBuilder();
                    ob.buildOrder([{ItemID: '234534132313', TransactionID: '244424444'}, {ItemID: '543219876543', TransactionID: '777777777' }])
                   
                    console.log(ob.response.OrderArray);
                    AddOrdersToDatabase(db, ob.response, this.callback);
                },
                'then get orders from database': {
                    topic: function() {
                        db.all(this.callback);
                    },
                    'should be updated': function(err, res) {
                        console.log(res);
                    }

                }
            }
        }
    }
}).addBatch({
