var fs = require("fs");
var express = require("express");
const csv = require('csv-parser');
const headers = ["id","depair","destair","indepartcode","inarrivecode","outflightno","outdepartdate","outdeparttime","outarrivaldate","outarrivaltime","outbookingclass","outflightclass","outcarriercode","inflightno","indepartdate","indeparttime","inarrivaldate","inarrivaltime","inbookingclass","inflightclass","incarriercode","originalprice","originalcurrency","reservation","carrier","oneway"];
var path=require('path');

module.exports = function(app){

    //This creates all the routes needed to query the data by using the headers from the csv file.
    for (var i = 0, len = headers.length; i < len; i++) {
        const header = headers[i];
        app.get("/Flight/" + header + "/:query?", (req, res) => {
            /*
            Using the ternary operator below it will look for the specific query aslong as the paramater exists
            if it does not it will display a message telling the user to follow the correct format
            */
            req.params.query != null ? getRecord(header,req.params.query,res) : res.send(`<h3>Please follow the following format</h3> <h3>/Flight/${header}/data</h3>`);
        });
    }


    /*
    This route will be used to show the user of all posible routes that can be used.
    */
      app.get("/Flight/", (req, res) => {
       var resp = `<h2>Available Routes</h2><a href="/Flight/all/"> Get All Records</a><br>`;
        for (var i = 0, len = headers.length; i < len; i++) {
            resp = resp + `<a href="/Flight/${headers[i]}"> Get via ${headers[i]}</a><br>`;
           
        }
        res.send(resp)
    });

        /*
    This route will be used to show the user of all posible routes that can be used.
    */
    app.get("/Flight/all", (req, res) => {
        getRecord(null,null,res)
    });

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname + '/views/index.html'));
        app.use(express.static(path.join(__dirname, 'views')));

    });

}

/**
 * This function filters the document and finds all relevant data to the query stated.
 * @param {*} header -  The type of information that you are looking for
 * @param {*} data  -  The query that will filter the data.
 * @param {*} res  - The response that allows the returning of the objects that have been found
 */
function getRecord(header,data,res){
    var records = []
    fs.createReadStream('./flighdata.csv').pipe(csv()).on('data', (row) => {

        //If the data matches it will add it to the record array.
        if(header != null){
            if(row[header] == data){
                records.push(row);
            }
        }else{
            records.push(row);
        }
        
      

    }).on('end', () => {
        //Checks if there is any segments with a flight with that id.
        if(header == "id"){
            fs.createReadStream('./flighdataSegments.csv').pipe(csv()).on('data', (row) => {

                //If the data matches it will add it to the record array.
           
                if(row["flightid"] == data){
                    records.push(row);
                }
               
              
        
            }).on('end', () => {res.send(JSON.stringify(records, null, 3));});
        }

    });
    
}