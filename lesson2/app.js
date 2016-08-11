"use strict";
/// <reference path="./../typings/tsd.d.ts" />
var express = require("express");
var utility = require("utility");
var _ = require("lodash");
var app = express();
app.get('/', function (req, res) {
    var q = req.query.q;
    var ss = _.isDate(new Date());
    console.log("ss:", ss);
    var md5Value = utility.md5(q);
    res.send(md5Value);
});
app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});
//  访问 http://localhost:3000/?q=arkia123 
