const Q = require('q');
const request = require('request');
const { exec } = require('child_process');


let default_headers = {
    "Content-Type": "application/json"
}


let agentOptions = {
    keepAlive: true,
    maxSockets: 256,
    // 'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1)'
}

let httpClient = {
    get: function (url, header) {

        let httpOptions = {
            url: url,
            method: "get",
            timeout: 10000,
            headers: header || default_headers,
            agentOptions: agentOptions,
            proxy: "http://127.0.0.1:7890"
        }

        return new Q.Promise(function (resolve, reject) {
            request.get(httpOptions, (err, res) => {
                if (err) {
                    reject(err);
                } else if (Number(res.statusCode) !== 200 && Number(res.statusCode) !== 201) {
                    console.log(`get返回码出错：${res.statusCode}`);
                    console.log(`请求url:${url}`);
                    reject(res.statusCode);
                } else {
                    let resJSON = JSON.parse(res.body)
                    return resolve(resJSON);
                }
            })
        })
    },

    post: function (url, params, header) {
        let httpOptions = {
            url: url,
            method: "post",
            body: typeof params !== 'string' ? params : JSON.stringify(params),
            timeout: 10000,
            headers: header || default_headers,
            agentOptions: agentOptions,
            // proxy:"http://127.0.0.1:1087"
        }

        return new Q.Promise(function (resolve, reject) {
            request.post(httpOptions, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (Number(res.statusCode) !== 200 && Number(res.statusCode) !== 201) {
                    console.log(`"post返回码出错："${res.statusCode}`);
                    console.log(`请求url:${url},body:${JSON.stringify(httpOptions)}`);
                    console.log(`"错误信息："${JSON.stringify(body)}\n`);
                    reject(res.statusCode);
                } else {
                    resolve(res);
                }
            })
        })
    },
}

module.exports = httpClient