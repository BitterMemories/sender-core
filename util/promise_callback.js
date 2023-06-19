const Q = require('q');

let promise_callback = function(functionName, params) {
    let self = this;
    params = Array.prototype.slice.call(params, 0);

    return new Q.Promise(function(resolve, reject) {
        params.push(function(err) {
            let args = Array.prototype.slice.call(arguments, 1);
            if (err) {
                return reject(err);
            }
            return resolve.apply(this, args);
        });

        try {
         self[functionName].apply(self, params);
        } catch (_error) {
            return reject(_error);
        }

    });
};

module.exports = promise_callback;
