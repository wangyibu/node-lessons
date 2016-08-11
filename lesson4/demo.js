"use strict";
var superagent = require("superagent");
var cheerio = require("cheerio");
var eventproxy = require('eventproxy');
var url = require("url");
var cnodeUrl = 'https://cnodejs.org';
superagent.get(cnodeUrl).end(function (err, res) {
    if (err) {
        return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('#main .topic_title').each(function (index, element) {
        var $element = $(element);
        // url.resolve('/one/two/three', 'four')         // '/one/two/four'
        // url.resolve('http://example.com/', '/one')    // 'http://example.com/one'
        // url.resolve('http://example.com/one', '/two') // 'http://example.com/two'
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });
    console.log(topicUrls);
    var ep = new eventproxy();
    ep.after('topic_html', topicUrls.length, function (topics) {
        topics = topics.map(function (topicPair) {
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
    topicUrls.forEach(function (topicUrl) {
        superagent.get(topicUrl)
            .end(function (err, res) {
            console.log('fetch ' + topicUrl + ' successful');
            ep.emit('topic_html', [topicUrl, res.text]);
        });
    });
});
