var xml2js = require('xml2js'),
 api = require('./ebay_config'),
    fs = require('fs'),
    xmlParser = new xml2js.Parser(),
    db = require('./database');

readMessage()

function readMessage(cb) {
    fs.readFile("./message.xml", "utf-8", function(err, xml) {
        xmlParser.parseString(xml, function(err, json_data) {
            parseMessage(json_data, function(err, message) {
                console.log(message.EIASToken);
                console.log(message.Sender);
            })
        })
    });
}

function parseMessage(message, cb) {
    var m = message["soapenv:Body"].GetMyMessagesResponse.Messages.Message;

    m._id = m.Sender + '-' + m.MessageID;
    delete m.SendingUserID;
    delete m.RecipientUserID;
    delete m.SendToName;
    delete m.Flagged;
    delete m.Read;
    delete m.Folder;
    delete m.Replied;
   m.Text = m.Text.replace('<![CDATA[', '');
   m.Text = m.Text.replace(/]]>$/, '');
   m.Text = m.Text.replace(/<(?:.|\n)*?>/gm, '');

    getEiasTokenForUser(m.Sender, function(err, res) {
        m.EIASToken = res;
        console.log(err, res);
        cb(err,m);
    })
}

function getEiasTokenForUser(userId, cb) {
    api.makeRequest("GetUser", function(err, res) {
    if(err == null) {
        var user = res.User.EIASToken;   
    }
        cb(err, user);  
    }, { UserID: userId }, "json")
}