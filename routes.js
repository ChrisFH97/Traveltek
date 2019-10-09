var fs = require("fs");
const csv = require('csv-parser');
const headers = ["id","depair","destair","indepartcode","inarrivecode","outflightno","outdepartdate","outdeparttime","outarrivaldate","outarrivaltime","outbookingclass","outflightclass","outcarriercode","inflightno","indepartdate","indeparttime","inarrivaldate","inarrivaltime","inbookingclass","inflightclass","incarriercode","originalprice","originalcurrency","reservation","carrier","oneway"];

module.exports = function(app){

    for (var i = 0, len = headers.length; i < len; i++) {
        const header = headers[i];
        app.get("/Flight/" + headers[i], (req, res) => {

            fs.createReadStream('./flighdata.csv').pipe(csv()).on('data', (row) => {
                console.log(header);
              // console.log(row.headers[i])
                
    
            }).on('end', () => {
                console.log('CSV file successfully processed');
            });
             res.json(["Tony","Lisa","Michael","Ginger","Food"]);
        });
    }




      app.get("/Flight/", (req, res) => {
       var resp = '<h2>Available Routes</h2>';
        for (var i = 0, len = headers.length; i < len; i++) {
            resp = resp + `<a href="/Flight/${headers[i]}"> Get via ${headers[i]}</a><br>`;
           
        }
        res.send(resp)
    });

}