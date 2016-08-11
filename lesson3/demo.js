"use strict";
var express = require("express");
var cheerio = require("cheerio");
var superagent = require("superagent");
var app = express();
app.get('/', function (req, res, next) {
    superagent.get('https://cnodejs.org/')
        .end(function (err, sres) {
        //  常规的错误处理
        if (err) {
            return next(err);
        }
        // sres.text 里面存储着网页的html内容，将它传给cheerio.load 之后
        // 就可以得到一个实现了jquery 接口的变量，我们习惯性地将它命名为‘$’
        // 剩下的就是jquery 的内容
        var $ = cheerio.load(sres.text);
        var items = [];
        $('#main .topic_title').each(function (index, element) {
            var $element = $(element);
            // attr href title
            items.push({
                title: $element.attr('title'),
                href: $element.attr('href'),
                text: $element.text()
            });
        });
        res.send(items);
    });
});
app.listen(3000, function () {
    console.log('website open');
});
