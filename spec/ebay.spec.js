var AddOrdersToDatabase = require('ebay_api/add_orders_to_database'),
    cradle = require('cradle'),
    events = require('events'),
    Response = require('ebay_api/response');
    
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

var counter = 0;

describe("Response", function() {
    it("should Response", function() {
        var r = new OrderRequestFactory();
            r.buildSingleLineItemOrder({
                BuyerUserID: "julia"
            }).buildSingleLineItemOrder();
        
        var d = new Response(r.toJSON());
        console.log(d.singleLineOrders);
    });
});

describe("Add orders to database", function() {
    it("should add single line item orders to database", function() {

        resetDb('2010-01-01T00:00:00.000Z');

        waitsFor(function() {
            return completed
        });

        runs(function() {
            var transaction = Factory("Transaction");
            var order = Factory("Order", { TransactionArray: { Transaction: transaction }, OrderID: transaction.OrderLineItemID } )
            var json = Factory("OrderResponse", { OrderArray: { Order: order } });
    
            AddOrdersToDatabase(db, json, function() {
                db.all(function(err, res) {
                    expect(res.length).toEqual(3);
                    counter++;
                });
                db.get(json.OrderArray.Order[0]._id, function(err, res) {
                    expect(res.OrderID).toEqual(json.OrderArray.Order[0]._id);
                    counter++;
                })
                db.get(json.OrderArray.Order[1]._id, function(err, res) {
                    expect(res.OrderID).toEqual(json.OrderArray.Order[1]._id);
                    counter++;
                })
                db.get('time', function(err, res) {
                    expect(res.lastUpdate).toNotEqual("2010-01-01T00:00:00.000Z");
                    counter++;
                })
            });
        })
        waitsFor(function() {
            return (counter == 4);
        });
        runs(function() {
            completed = null;
        });
    });

})