/// <reference path="./../typings/tsd.d.ts" />
import * as express from "express";
import * as utility from "utility";
import * as _ from "lodash";
var app = express();
app.get('/',(req,res)=>{
    var q = req.query.q;

    var ss = _.isDate(new Date());

    console.log("ss:",ss);

    var md5Value = utility.md5(q);
    res.send(md5Value);
});

app.listen(3000,(req,res)=>{
    console.log('app is running at port 3000');
});


//  访问 http://localhost:3000/?q=arkia123