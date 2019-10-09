var fs = require("fs");
const csv = require('csv-parser');
const headers = ["id","depair","destair","indepartcode","inarrivecode","outflightno","outdepartdate","outdeparttime","outarrivaldate","outarrivaltime","outbookingclass","outflightclass","outcarriercode","inflightno","indepartdate","indeparttime","inarrivaldate","inarrivaltime","inbookingclass","inflightclass","incarriercode","originalprice","originalcurrency","reservation","carrier","oneway"];

module.exports = function(app){

    for (var i = 0, len = headers.length; i < len; i++) {
        const header = headers[i];
        app.get("/Flight/" + header + "/:query?", (req, res) => {

            if(req.params.query != null){

                getRecord(header,req.params.query,res);

            }else{
                res.send(`<h3>Please follow the following format</h3> <h3>/Flight/${header}/data</h3>`)
            }


        });
    }




      app.get("/Flight/", (req, res) => {
       var resp = `<h2>Available Routes</h2><a href="/Flight/all/"> Get All Records</a><br>`;
        for (var i = 0, len = headers.length; i < len; i++) {
            resp = resp + `<a href="/Flight/${headers[i]}"> Get via ${headers[i]}</a><br>`;
           
        }
        res.send(resp)
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
        if(row[header] == data){
            records.push(row);
        }

    }).on('end', () => {

        res.send(JSON.stringify(records, null, 3));
    });
}