const express  = require('express');
const bodyParse = require('body-parser');
const csv = require('csvtojson');
const app = express();



// const port =8000;
// app.listen(port,() => {
    
// });

var jsonData = [];

csv().fromFile("sachin.csv").on('json',function(data){
jsonData.push(data);
    
})



app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
    
 app.get('/',function(req,res,next){

res.send(jsonData);
     
 })   

module.exports = app;