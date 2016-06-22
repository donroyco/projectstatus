'use strict';

var requestP = require('request-promise');
var q = require('q');

function getServerStatus() {

    var defer = q.defer();

	var lastStatus = 'unknown';
	console.log('see if building');
    requestP(`https://www.ute1.klm.com/ams/beta/myweb/api/customer/current`)
    .then(function (result) {
        defer.resolve('ok');
    })
    .catch(function (err) {
        // parsing failed 
        console.log('error index: ', err);
        defer.reject(err);
    });

    return defer.promise;
}


module.exports = {
    getServerStatus: getServerStatus
};

