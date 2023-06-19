const SETTINGS = require('./coin_backend_setting')


let coin_backend = {

    get_coin_settings : function ()
    {
        return SETTINGS;
    },

    get_coin_setting : function (curr_type)
    {
        if (typeof(SETTINGS[curr_type]) !== 'undefined')
            return SETTINGS[curr_type];
        else
            return null;

    },
}

module.exports = coin_backend;