let mysql = require('mysql2');
let promise_callback = require('./promise_callback');
let config = require("../config/db_config");

let _pool = null;


let db = {

    _createPool: function (dbConfig) {
        let pool = mysql.createPool({
            host: dbConfig.host,
            user: dbConfig.user,
            password:dbConfig.password,
            database: dbConfig.database,
            charset: dbConfig.charset, //应该设置编码（省略在某些情况下会有错误）
            connectionLimit: dbConfig.connectionLimit, //单次可创建最大连接数

            //以下选项均为默认值（如果不需要变动可省略）
            acquireTimeout:10000, //获取连接的毫秒
            waitForConnections: true, //为true时，连接排队等待可用连接。为false将立即抛出错误
            queueLimit: 0 //连接池的最大请求数，从getConnection方法前依次排队。设置为0将没有限制
        })

        return pool
    },

    pool: function () {
        _pool = db._createPool(config.db);
        console.log('create read pool');

        return _pool
    },

    end: function () {
        if (_pool) {
            _pool.end();
        }
    },

    exec : function() {
        let params = Array.prototype.slice.call(arguments, 0);
        return promise_callback.apply(db.pool(), ['query', params]);
    },

    escape: function(str) {
        return mysql.escape(str);
    },

}

let DbError = function(msg, error) {
    this.msg = msg;
    this.error = error;
}

DbError.prototype.toString = function() {
    let str = 'DbError';
    if (this.msg) {
        str = str + ':' + this.msg;
    }
    if (this.error && this.error.stack) {
        str = str + '\n' + this.error.stack;
    }
    return str;
};

module.exports = db;
module.exports.DbError = DbError;