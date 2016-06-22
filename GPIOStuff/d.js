'use strict';

// Diego explained how promises work, with this module.

module.exports = {
	defer: function() {
		let successFn = [];
		let failedFn = [];

		return {promise: CreatePromise(successFn, failedFn), 
				resolve: function () {
					var args = Array.prototype.slice.call(arguments);
					successFn.forEach(function(functionToExecute) {
						functionToExecute.apply(null, args);
					});
				},
				reject: function () {
					var args = Array.prototype.slice.call(arguments);
					failedFn.forEach(function(functionToExecute) {
						functionToExecute.apply(null, args);
					});
				}
			}
	}
    
};

function CreatePromise(successFn, failedFn) {
	return {then: function (fn) {
				successFn.push(fn);
			},
			catch: function (fn) {
				failedFn.push(fn);
			}
		}
}