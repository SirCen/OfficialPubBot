const {papago_url, papago_client_id, papago_client_secret} = require('../apiconfig.json');
const request =  require('request');

module.exports = class Papago {
    translate(text, source, target) {
        this.options = {
            url: papago_url,
            form: {
                source,
                target,
                text,
            },
            headers: {
                'X-Naver-Client-Id': papago_client_id,
                'X-Naver-Client-Secret': papago_client_secret
            },
        };
        
        return new Promise((resolve, reject) => {
            request.post(this.options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const {result} = JSON.parse(body).message;
                    resolve({
                        text: result.translatedText,
                        source: result.srcLangType,
                        target: result.tarLangType,
                    });
                } else {
                    reject(error);
                }
            });
        });
    }
}