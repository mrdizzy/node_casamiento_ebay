var api = require('./ebay_config'),
_ = require('underscore');
console.log("BEFORE");


getMyMessagesHeaders(function(err,res) {});

function getEiasTokenForUser(userId, cb) {
    api.makeRequest("GetUser", function(err, res) {
    if(err == null) {
        var user = res.User.EIASToken;   
    }
        cb(err, user);  
    }, { UserID: userId }, "json")
}


function getMyMessagesReturnMessages(messages,cb) {
       var messageIDs = inGroupsOf(messages,10);
       var waiting = messageIDs.length;
       var messages = [];
       messageIDs.forEach(function(messageID) {
           api.makeRequest("GetMyMessages", function(err, res) {
               messages.push(res.Messages.Message)
               waiting--;
               if(!waiting) {
                   messages = _.flatten(messages);
                   cb(err, messages);
               }
           }, { DetailLevel: "ReturnMessages", MessageIDs: { MessageID: messageID }}, "json")
       });
}

// Get MyMessages Headers

function getMyMessagesHeaders(cb) {
    api.makeRequest("GetMyMessages", function(err, res) {
        var response = res;
        var messages = res.Messages.Message;
        var results = [];
        var waiting = messages.length;
        var messageIDs = _.collect(messages, function(m) {
            return m.MessageID;   
        });
        getMyMessagesReturnMessages(messageIDs, function(err, res) {
            console.log(res);
            });
      //  messages.forEach(function(message) {
            
       //     getEiasTokenForUser(message.Sender, function(err, res) {
       //         results.push(res);
       //         waiting--;
        //        if(!waiting) {
        //         cb(null, results);   
         //       }
         //   });
      //  });
    }, {
        DetailLevel: "ReturnHeaders"
    }, "json");
}

// 

// GetMyMessages Summary

function getMyMessagesSummary() {
    api.makeRequest("GetMyMessages", function(err, res) {
console.log(res);
    }, {
        DetailLevel: "ReturnSummary"
    }, "json");
}

function inGroupsOf(ary, num){
    var ret = [],
        length = ary.length,
        groups = Math.ceil(length / num);
 
    for(var i = 0; i < groups; i++){
        var start = i * num,
            end   = start + num;
 
        ret.push(ary.slice(start, end))
    }
    return ret;
}
