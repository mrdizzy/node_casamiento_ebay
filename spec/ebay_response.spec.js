var Factory = require('ebay_api/ebay_getorders_factory'),
    AddOrdersToDatabase = require('ebay_api/add_orders_to_database'),
    cradle = require('cradle');

var db = new(cradle.Connection)('http://casamiento.iriscouch.com').database('test_ebay');

var completed = null;

function resetDb(newTime) {
    db.destroy(function(err, res) {
        console.log("Destroying database, ", err, res);
        db.create(function(error, response) {
            db.save('time', {
                lastUpdated: newTime
            }, function(e, r) {
                completed = true;
            })
        });
    });
}

describe("parse response with 1 x single line order", function() {
    it("should add 1 single order to database", function() {

        resetDb('2010-01-01T00:00:00.000Z');

        waitsFor(function() {
            return (completed);
        });

        var transaction = Factory("Transaction");
        var order = Factory("Order", {
            TransactionArray: {
                Transaction: transaction
            },
            OrderID: transaction.OrderLineItemID
        })
        var json = Factory("OrderResponse", {
            OrderArray: {
                Order: order
            }
        });
        runs(function() {
            AddOrdersToDatabase(db, json, function() {
                console.log("DONE");
            });
        });
    });

    it("should save orders when conflict", function() {
        waits(1000)
        runs(function() {
            completed = null;
            resetDb('2010-01-01T00:00:00.000Z');
        });
        waitsFor(function() {
            return (completed);
        });
        var transaction = Factory("Transaction");
        var order = Factory("Order", {
            TransactionArray: {
                Transaction: transaction
            },
            OrderID: transaction.OrderLineItemID
        })
        var json = Factory("OrderResponse", {
            OrderArray: {
                Order: order
            }
        });
        runs(function() {
            AddOrdersToDatabase(db, json, function() {
                console.log("DONE");
            });
        });
        waits(2000);
        runs(function() {
            AddOrdersToDatabase(db, json, function() {
                console.log("DONE");
            });
        });

    });

    it("should combine orders", function() {

        waits(3000);
        runs(function() {
            completed = null;
            resetDb('2010-01-01T00:00:00.000Z');
        });
        waitsFor(function() {
            return (completed);
        });
        
        var transaction = Factory("Transaction");
        var order = Factory("Order", {
            TransactionArray: {
                Transaction: transaction
            },
            OrderID: transaction.OrderLineItemID
        })
        var json = Factory("OrderResponse", {
            OrderArray: {
                Order: order
            }
        });
        // Add single line order
        runs(function() {
            AddOrdersToDatabase(db, json, function() {
                console.log("DONE");
            });
        });
        
        var transaction1 = Factory("Transaction", { OrderLineItemID: '110099445588-999888777', TransactionID: '999888777' });
        var transaction2 = Factory("Transaction", { OrderLineItemID: '113355667788-991123333', TransactionID: '991123333' });
        
        var order = Factory("Order", { TransactionArray: { Transaction: [ transaction1, transaction2 ] }, OrderID: '325423521' });
        var result = Factory("OrderResponse", { OrderArray: { Order: order } });
        
        waits(6000);
        
        runs(function() {
            AddOrdersToDatabase(db, result, function() {
                console.log("DONE");
            });
        });
        
    });

});