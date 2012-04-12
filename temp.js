    it("should add single line item orders to database", function() {

        resetDb('2010-01-01T00:00:00.000Z');

        waitsFor(function() {
            return completed
        });

        runs(function() {
            var response = new OrderRequestFactory();
            response.buildSingleLineItemOrder({
                BuyerUserID: "julia"
            }).buildSingleLineItemOrder();

            var json = response.toJSON();

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