const Q = require("q");
const exec = require('child_process').exec;


let curlUtil = {
    getCoinGeckoTokenPrice: Q.async(function* (url, timeout) {
        timeout = timeout || 20000;//默认20秒

        return new Promise(function(resolve,reject){
            let done = false;
            let id = setTimeout(() => {

                clearTimeout(id);

                //log.info('curl ' + url + ' timeout in ' + timeout + 'ms.');

                myReject('curl ' + url + ' timeout in ' + timeout + 'ms.');

            }, timeout);

            let myReject = function (message) {
                if (done) {
                    return;
                }
                clearTimeout(id);
                done = true;
                reject(message);
            };

            let myResolve = function (message) {
                if (done) {
                    return;
                }
                clearTimeout(id);
                done = true;
                resolve(message);
            };

            let curlCmd = "curl --proxy '127.0.0.1:7890' -k '"+ url +"' \\\n" +
                "  -H 'authority: api.coingecko.com' \\\n" +
                "  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \\\n" +
                "  -H 'accept-language: zh-CN,zh;q=0.9' \\\n" +
                "  -H 'cache-control: max-age=0' \\\n" +
                "  -H 'cookie: _gcl_au=1.1.2025230096.1686706041; __hstc=234611265.d44d0cddd23227da30a7fd0039744a1b.1686903420326.1686903420326.1686903420326.1; hubspotutk=d44d0cddd23227da30a7fd0039744a1b; __hssrc=1; __cuid=34f696b6aad64f9481cf279147204a41; amp_fef1e8=a662e829-1ec9-45f7-b221-53bb3d4d020dR...1h36ie61p.1h36iu08q.v.3.12; _ga_4PE9HX30YZ=GS1.1.1687067462.2.1.1687070481.0.0.0; cf_clearance=vFF2ao1nWbZ2eGz6nzkVz_Hy26k4xTDsUJooWTp8xRk-1687081323-0-250; _gid=GA1.2.346480566.1687081340; _ga_LJR3232ZPB=GS1.1.1687081339.9.1.1687081819.0.0.0; _ga=GA1.2.325701494.1641902330; datadome=7nQhppQPoqy-DWW8nrj9X69sOzOOiIZb5gHssI7-h1VTAVPh0L2RMebePSDXTWMAIE2NCi54-eqDdEB2fQUxwag_yg-J6fUosUflPXiIj36DOWVggWMjbKG4S~qgfjfn' \\\n" +
                "  -H 'if-none-match: W/\"df9ed0d7f65e17d7052d301fc0a7cba7\"' \\\n" +
                "  -H 'sec-ch-ua: \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"' \\\n" +
                "  -H 'sec-ch-ua-mobile: ?0' \\\n" +
                "  -H 'sec-ch-ua-platform: \"macOS\"' \\\n" +
                "  -H 'sec-fetch-dest: document' \\\n" +
                "  -H 'sec-fetch-mode: navigate' \\\n" +
                "  -H 'sec-fetch-site: none' \\\n" +
                "  -H 'sec-fetch-user: ?1' \\\n" +
                "  -H 'upgrade-insecure-requests: 1' \\\n" +
                "  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' \\\n" +
                "  --compressed";

            exec(curlCmd, {maxBuffer: 1024 * 500}, function(err,stdout,stderr){
                if(err) {
                    myReject("curl " + url + " error:" + err);
                } else {
                    myResolve(stdout);
                }
            });
        })
    })

}

module.exports = curlUtil