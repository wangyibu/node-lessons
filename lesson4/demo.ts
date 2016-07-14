import * as superagent from "superagent";
import * as cheerio from "cheerio";
var eventproxy = require('eventproxy');

import * as url from "url";

var cnodeUrl = 'https://cnodejs.org';

superagent.get(cnodeUrl).end((err,res)=>{
    if(err){
        return console.error(err);
    }
    var topicUrls =[];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('#main .topic_title').each((index,element)=>{
        var $element = $(element);

// url.resolve('/one/two/three', 'four')         // '/one/two/four'
// url.resolve('http://example.com/', '/one')    // 'http://example.com/one'
// url.resolve('http://example.com/one', '/two') // 'http://example.com/two'

        var href = url.resolve(cnodeUrl,$element.attr('href'));
        topicUrls.push(href);
    });
    console.log(topicUrls);
});