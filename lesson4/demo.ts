import * as superagent from "superagent";
import * as cheerio from "cheerio";
var eventproxy = require('eventproxy');

import * as url from "url";

var cnodeUrl = 'https://cnodejs.org';

superagent.get(cnodeUrl).end((err, res) => {
    if (err) {
        return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('#main .topic_title').each((index, element) => {
        var $element = $(element);

        // url.resolve('/one/two/three', 'four')         // '/one/two/four'
        // url.resolve('http://example.com/', '/one')    // 'http://example.com/one'
        // url.resolve('http://example.com/one', '/two') // 'http://example.com/two'

        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });
    console.log(topicUrls);

    var ep = new eventproxy();
    ep.after('topic_html', topicUrls.length, (topics) => {

        topics = topics.map((topicPair) => {
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml);
            return {
                title: $('.topic_full_title').text().trim(),
                href: topicUrl,
                comment1: $('.reply_content').eq(0).text().trim()
            };
        });
        console.log('final:');
        console.log(topics);
    });

    topicUrls.forEach((topicUrl) => {
        superagent.get(topicUrl)
            .end((err, res) => {
                console.log('fetch ' + topicUrl + ' successful');
                ep.emit('topic_html', [topicUrl, res.text]);
            });
    });
});