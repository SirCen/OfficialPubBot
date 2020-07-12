const request = require('request');
const cheerio = require('cheerio');

module.exports = class koreanDictApi {
    parseResult(html, maxSenses) {
        const $ = cheerio.load(html, {normalizeWhitespace: true});
        this.entries = $('./search_list').children();
        const count = this.entries.length;
        const dictEntries = [];

        for (let i = 0; i < count; i++) {
            const dictEntry = {};

            const entry = $(this.entries).eq(i).children();
            const title = entry.eq(0);

            dictEntry.word = $(title).find('a').eq(0).text().replace(/\s+/g, ' ').trim();

            const h = title.text().match(/\(.*\)/);
            const p = title.text().match(/\[(.*?)\]/);

            let s;
            if ($(title).find('.score_3').length > 0) {
                s = 3;
            } else if ($(title).find('.score_2').length > 0) {
                s = 2;
            } else if ($(title).find('score_1').length > 0) {
                s = 1;
            } else {
                s = 0;
            }

            dictEntry.stars = s;

            let hanja;
            if (h) {
                hanja = h[0].slice(1, -1).trim();
            }
            dictEntry.hanja = hanja;

            let pronounciation;
            if (p && p[1]) {
                pronounciation = p[1].trim();
            }
            dictEntry.pronounciation = pronounciation;

            dictEntry.wordType = $(title).find('em').eq(0).text().replace(/\s+/g, ' ').trim();
            
            dictEntry.wordTypeTranslated = $(title).find('em').eq(1).text().replace(/\s+/g, ' ').trim();

            const senses = $(entry).eq(1).children();
            const entrySense = [];
            for (let j = 0; j < senses.length; j++) {
                if (maxSenses && j > maxSenses) {
                    break;
                }
                const current = senses.eq(i).children();
                const sense = {};
                sense.meaning = current.eq(0).text().replace(/\s+/g, ' ').replace(/\d*\.\d*/, '').trim();
                sense.definition = current.eq(1).text().replace(/\s+/g, ' ').trim();
                sense.translation = current.eq(2).text().replace(/\s+/g, ' ').trim();
                entrySense.push(sense);
            }
            dictEntry.senses = entrySense;
            dictEntries.push(dictEntry);
        }
        if (dictEntries.length === 1 && dictEntries[0].word === '') {
            return [];
        }
        return dictEntries;
    }

    searchWords(q, amount) {
        this.url = `https://krdict.korean.go.kr/eng/dicSearch/search?nation=eng&sort=C&nationCode=6&ParaWordNo=&blockCount=${amount}&mainSearchWord=${q}`;
        const promise = new Promise((resolve, reject) => {
            request(encodeURI(this.url), (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(this.parseResult(body));
                } else {
                    reject(error);
                }
            });
        });
        return promise;
    }
}