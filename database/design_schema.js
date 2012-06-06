// Map functions:
module.exports = {
    "customers": {
        eias_token: {
            map: function(doc) {
                if (doc.type == 'customer' && doc.EIASToken) {
                    emit(doc.EIASToken, doc);
                }
            }
        },
        name: {
            map: function(doc) {
                if (doc.name) {
                    emit(doc.name, doc);
                }
            }
        }
    }
}