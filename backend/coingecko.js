const Q = require("q");
const db = require('../util/db')
const httpClient = require('../util/http_request')
const BigNumber = require('bignumber.js')
const coinBackend = require('../backend/coin_backend/coin_backend')
const tokenMarketDB = require('../model/token_market_db')
const curlUtil = require('../util/curl_util')

const apiEndpoint = 'https://api.coingecko.com'

const SETTING = {

    ETH: {
        id: 'ethereum',
        assetPlatformId: 'ethereum'
    },

    BSC: {
        id: 'bowscoin',
        assetPlatformId: 'binance-smart-chain'
    },

    MATIC: {
        id: 'matic-network',
        assetPlatformId: 'polygon-pos'
    },

    AVAX: {
        id: 'avalanche-2',
        assetPlatformId: 'polygon-pos'
    },

    AURORA: {
        id: 'aurora-near',
        assetPlatformId: 'aurora'
    },

    ARB: {
        id: 'arbitrum',
        assetPlatformId: 'arbitrum-one'
    },

    OP: {
        id: 'optimism',
        assetPlatformId: 'optimistic-ethereum'
    },

    TON: {
        id: 'the-open-network',
        assetPlatformId: ''
    },

    NEAR: {
        id: 'near',
        assetPlatformId: 'near-protocol'
    }

}


let coingecko = {

    getContractList: Q.async(function* (assetPlatformId) {
        let data = yield httpClient.get('https://tokens.coingecko.com/'+assetPlatformId+'/all.json')
        let tokenList = data.tokens
        if (tokenList.length > 0) {
            tokenList = tokenList.slice(0, 100)
        }
        return tokenList
    }),

    getTokenMarket: Q.async(function* (url, params) {

        if (params.assetPlatformId) {
            url = url.concat("/" + params.assetPlatformId + '?')
        }

        if (params.ids && params.ids.length > 0) {
            url = url.concat(`?ids=` + params.ids.join(','))
        }

        if (params.vsCurrencies) {
            url = url.concat(`&vs_currencies=` + params.vsCurrencies)
        }

        if (params.contractAddresses && params.contractAddresses.length > 0) {
            url = url.concat(`&contract_addresses=` + params.contractAddresses.join(','))
        }

        let uri = apiEndpoint + url

        let body = yield curlUtil.getCoinGeckoTokenPrice(uri)

        return JSON.parse(body)
    }),


    run: Q.async(function* () {
        let coinPriceUrl = '/api/v3/simple/price'
        let tokenPriceUrl = '/api/v3/simple/token_price'

        for (const currType in SETTING) {
            let object = SETTING[currType]
            let id = object.id
            let assetPlatformId = object.assetPlatformId

            //拿到公链价格
            let coinPriceParams = {
                ids: [id],
                vsCurrencies: 'usd'
            }
            let coinPrice = yield coingecko.getTokenMarket(coinPriceUrl, coinPriceParams)
            let coinPriceEntity = {
                currType: currType,
                symbol: '',
                tokenAddress: '',
                price: coinPrice[id]['usd']
            }
            yield tokenMarketDB.insertExistMarketToken(null, coinPriceEntity)


            //获取当前链的所有token
            let tokenAddressList = []

            let tokenList = yield coingecko.getContractList(assetPlatformId)
            for (let i = 0; i < tokenList.length; i++) {
                let token = tokenList[i]
                tokenAddressList.push(token.address)
            }

            let tokenPriceParams = {
                assetPlatformId: assetPlatformId,
                contractAddresses: tokenAddressList,
                vsCurrencies: 'usd'
            }

            //拿到当前链所有token的价格
            let tokensPrice = yield coingecko.getTokenMarket(tokenPriceUrl, tokenPriceParams)
            for (let tokenAddress in tokensPrice) {
                let tokenPrice = tokensPrice[tokenAddress]

                if (!tokensPrice || !tokenPrice['usd']) {
                    continue
                }

                let marketTokenEntity = {
                    currType: currType,
                    symbol: '',
                    tokenAddress: tokenAddress,
                    price: tokenPrice['usd']
                }

                yield tokenMarketDB.insertExistMarketToken(null, marketTokenEntity)
            }
        }

    })

}

// Q.async(function*() {
//     try {
//         while (true) {
//             yield coingecko.run()
//             yield Q.delay(5000)
//         }
//     } catch (err) {
//         console.error(err);
//     }
//     console.info("done!");
//     db.end();
// })().done();