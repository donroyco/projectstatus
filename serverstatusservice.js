'use strict';

var requestP = require('request-promise');
var q = require('q');

function getServerStatus() {

    var defer = q.defer();

    requestP({uri: 'https://www.ute1.klm.com/ams/beta/myweb/api/customer/current', resolveWithFullResponse: true })
    .then(function (response) {
        if (response.statusCode && response.statusCode < 400) {
            defer.resolve({'value': 'up', 'info': 'up'});
        } else {
            defer.resolve({'value': 'down', 'info': 'down'});
        }
    })
    .catch(function (err) {
        // parsing failed 
        // console.log('error index: ', err);
        defer.resolve('error');
        defer.resolve({'value':'error', 'info': err});
    });

    return defer.promise;
}

module.exports = {
    getServerStatus: getServerStatus
};

