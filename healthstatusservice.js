'use strict';

var requestP = require('request-promise');
var q = require('q');

var HealthStatus = function (portConfig, healthURL) {
    this.lampRedPort = portConfig.lampRedPort;
    this.lampGreenPort = portConfig.lampGreenPort;
    this.lampBluePort = portConfig.lampBluePort;
    this.currentColor = 'off';
    this.healthURL = healthURL;

}

// properties and methods
HealthStatus.prototype = {
        getHealthStatus: function() {

        var defer = q.defer();

        requestP({uri: this.healthURL, resolveWithFullResponse: true, timeout: 7000 })
        .then(function (response) {
            if (response.statusCode && response.statusCode < 400) {
                defer.resolve({'value': 'up', 'info': 'up'});
            } else {
                defer.resolve({'value': 'down', 'info': 'down'});
            }
        })
        .catch(function (err) {
            defer.resolve({'value':'error', 'info': err.message});
        });

        return defer.promise;
    }
}

module.exports = HealthStatus;

