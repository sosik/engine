(function () {
	/**
	 * does double encoding of string to prevent browser and
	 * server automatic decode
	 */
	var encode = function(_in) {
		var tmp = encodeURIComponent(_in);
		var out = tmp.replace(/%/g, '~_~');

		return out;
	};

	/**
	 * does decoding of previously encoded string by encode function
	 */
	var decode = function(_in) {
		var tmp =  _in.replace(/~_~/g, '%');
		var out = decodeURIComponent(tmp);

		return out;
	};

	// are we in nodejs?
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = {
			encode: encode,
			decode: decode
		};
	}

	// are we in angular
	if (typeof angular !== 'undefined') {
		angular.module('registries').factory('registries.safeUrlEncoder', [function() {
			return {
				encode: encode,
				decode: decode
			};
		}]);
	}
}());
