const querystring = require('querystring');
const request = require('request');
const eTree = require('elementtree');
const { krdict_url, krdict_token } = require('../apiconfig.json');

module.exports = class SentenceExampleAPI {
    constructor() {
        this.options = {
            key: krdict_token,
            type_search: 'search',
            part: 'exam',
            method: 'exact',
            multimedia: 0,
            sort: 'dict',
        };
    }

    searchExamples(q) {
        this.options.q = q;
        const url = `${krdict_url}search?${querystring.stringify(this.options)}`;
        const options = {
            url,
            headers: {
                'content-type': 'application/xml',
                Accept: 'application/xml',
            },
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

    parseExampleResult(r) {
        this.exampleEntries = [];
        eTree.parse(r).findall('item').forEach((item) => {
            const entry = {word: item.find('word').text};
            entry.example = item.find('example').text.trim();
            this.exampleEntries.push(entry);
        });
        return this.exampleEntries;
    }
}