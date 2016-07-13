/// <reference path="./../typings/tsd.d.ts" />
import * as express from "express";
import * as utility from "utility";
import * as lodash from "lodash";
var app = express();
app.get('/',(req,res)=>{
    var q = req.query.q;

    console.log(_.isDate(new Date()));

    var md5Value = utility.md5(q);
    res.send(md5Value);
});

app.listen(3000,(req,res)=>{
    console.log('app is running at port 3000');
});


//  访问 http://localhost:3000/?q=arkia123