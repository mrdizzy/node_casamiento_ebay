var xml2js = require('xml2js'),
    cradle = require('cradle'),
    xmlParser = new xml2js.Parser(),
    eBayTradingAPI = require('./ebay_trading_api'),
    GetOrdersResponse = require('./ebay_response'),
    _ = require('underscore');
    
// eBay Credentials 
var appId = 'Casmient-2aff-4dab-9163-50f440216b96',
    devId = 'c8d4d396-f869-44d9-8798-df4c2de90717',
    certId = '454dd9f0-47d0-4871-ab91-ab0038a59cd3',
    authToken = 'AgAAAA**AQAAAA**aAAAAA**kRoiTg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4CoAZeCpQ6dj6x9nY+seQ**JpMBAA**AAMAAA**oZA6Ywa6Ma6zNlkw3cqilP+685HQPlP4Bf1XAf+2Rt9V77dU94zFnoj4nhflnUipahn1Fy2roxApfA5ELDRgedWuspTUBirBQ5bAsuq9Btysg3p4KCq5+vsLLi3gyElWAOOOEvjTe24GHXDyHxrJsci0Ht3gMvOQ0rllbdiplsymNRY0+lXrS4jGrLRV3VCwbA2rAuhDhEaJbBH0GNP+YRO2GEerOQUGmA1/zeGYOfa/ZyU/7vQYZoBFG+v+31rxfqlOVo53o9lOo2QVfI1TDRtlsQBaBe159Shbe686AdRod5zAlimUtpzV9/9OqeMDGHqjWi39CsCjTDctOsLm3Ck/h8nJcOkOHCa2aDvW1ney+77L8HljBIBCNBkNookq13s51zRjQh+vekwBi2ja0hZgIlKULFp3QZdF8np9qlhPjWT90udSQiy2hczfFQmK/vCW2dY8OD+6bcPLQa/ruTVMMLQKga3Hdi4oFxJlhLcH3hpi4Z4vunOYnxGhtva2iQpLUfRBwHpCNr2swDQDT8Y4BLkn0GpNAqaOBX700f+uywf0BnOwYwdyL7+kx/8TMR0lwTJvmlPguukEY/zMtrTIChiX6sDAAXTep9H5plEvUKmBwwqxo+Jy15kIkkmMQh5eq58I+/Zw+PWF7sNn7rWLTQyqexrPImWG3hqQlNF2O4F29DWQCfKtiD+Y+RzOF3vngtgeQmCbdWKnP9OXaxIitTuRsDagj5ebjU0DNWkX5/6eQlDScp3fVMNi0pgf';

var db = new(cradle.Connection)("http://casamiento.iriscouch.com").database('ebay');

// Get last imported time and begin import
db.get('time', function(err, res) {
    if (err) {
        console.log("Could not get last imported time: ", err);
    }
    else {
        ImportOrders(res.lastModified);
    }
});

function ImportOrders(fromTime) {
    var eBayAPI = new eBayTradingAPI(appId, "3", devId, certId, authToken);
    eBayAPI.makeRequest("GetOrders", function(xmlResult) {
        parseXML(xmlResult);
    }, { ModTimeFrom: fromTime, ModTimeTo: new Date().toISOString() });
};

function parseXML(xmlResult) {    
    xmlParser.parseString(xmlResult, function(err, jsonData) {
        if (err) {
            console.log("Error parsing xml result: ", err);
        }
        else {
            createResponse(jsonData);
        }
    });
}
function createResponse(jsonData) {
    var ordersResponse = new GetOrdersResponse(jsonData);

    if (ordersResponse.TotalOrders() > 0) {
        var rawOrders = ordersResponse.RawOrders();
        console.log(ordersResponse.OrdersById());
        //    checkForDuplicates(ordersResponse);
       
            db.save(rawOrders, function(err, res) {
                if (err) {
                    console.log(err);
                    if(err.error === "not_found")
                    {
                        db.merge(order, function(error, response) {
                           console.log(error, response); 
                        });
                    }
                }
                else {                    
                    console.log(res);
                }
            })
        
        
    }
    console.log("DONE");
}