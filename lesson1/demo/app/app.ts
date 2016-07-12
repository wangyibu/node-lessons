/// <reference path="./../../../typings/tsd.d.ts" />
import * as express from "express";
var app = express();
app.get('/',(req,res)=>{
    res.send('hello world');
})

app.listen(3000,()=>{
    console.log('app is listening at port 3000');
});