const Q = require('q');
const DbError = require('../util/db.js').DbError;
const db = require('../util/db.js');


const TABLE = "token_market";
const SELECT_FIELDS = "id,curr_type,symbol,address,price,ctime,utime";
const INSERT_FIELDS = "curr_type,symbol,token_address,price";



var SQL = {
    INSERT_TOKEN_MARKET : "insert into " + TABLE + " (" + INSERT_FIELDS + " ) values (?,?,?,?)",
    UPDATE_PRICE_CURRTYPE_TOKENADDRESS : "update " + TABLE + " set price=? where curr_type=? and token_address=?",
    INSERT_EXIST_TOKEN_MARKET: "insert into " + TABLE + " (" + INSERT_FIELDS + " ) values (?,?,?,?) ON DUPLICATE KEY UPDATE price=?" ,
};


var TokenMarketDB = {

    fromRow: function (row) {
        let tokenMarket = {};

        tokenMarket.id = row["id"];
        tokenMarket.currType = row["curr_type"];
        tokenMarket.tokenAddress = row["token_address"];
        tokenMarket.symbol = row["symbol"];
        tokenMarket.price = row["price"];
        tokenMarket.ctime = row["ctime"] ? row["ctime"].getTime() : row["ctime"];
        tokenMarket.utime = row["utime"] ? row["utime"].getTime() : row["utime"];

        return tokenMarket;

    },

    fromRows: function (rows) {
        if (!rows) {
            return [];
        }

        if (rows.length <= 0) {
            return [];
        }

        return rows.map(function (item) {

            return TokenMarketDB.fromRow(item);
        });
    },

    insertTokenMarket : Q.async(function* (conn, tokenMarketEntity){
        try{

            conn = conn || db;

            let row = yield conn.exec(SQL.INSERT_TOKEN_MARKET,[
                tokenMarketEntity.currType,
                tokenMarketEntity.symbol,
                tokenMarketEntity.tokenAddress,
                tokenMarketEntity.price]);
            return row.insertId;
        } catch (e){
            console.error(e);
            throw new DbError("insertTokenMarket internal error",e);
        }
    }),

    updatePriceFromCurrTypeTokenAddress : Q.async(function* (conn, currType, symbol, tokenAddress, price){
        try{

            conn = conn || db;

            var row = yield conn.exec(SQL.INSERT_TOKEN_MARKET,[
                currType,
                symbol,
                tokenAddress,
                price]);
            return row.insertId;
        } catch (e){
            console.error(e);
            throw new DbError("updatePriceFromCurrTypeTokenAddress internal error",e);
        }
    }),

    insertExistMarketToken: Q.async(function* (conn, marketTokenEntity) {
        try{
            conn = conn || db;
            let row = yield conn.exec(SQL.INSERT_EXIST_TOKEN_MARKET,[
                marketTokenEntity.currType,
                marketTokenEntity.symbol,
                marketTokenEntity.tokenAddress,
                marketTokenEntity.price, marketTokenEntity.price]);
            return row.affectedRows > 0;
        } catch (e){
            console.error(e);
            throw new DbError("insertExistMarketToken internal error",e);
        }
    })
}

module.exports = TokenMarketDB;