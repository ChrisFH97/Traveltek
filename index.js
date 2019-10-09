var express = require("express");
var app = express();
var port = 25565;

var routes = require("./routes.js")(app);

app.listen(port, () => {
 console.log("Server running on port " + port);
});
