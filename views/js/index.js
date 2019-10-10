document.addEventListener('DOMContentLoaded', addClickEvent, false);

/* 
Adds click events to each of the nav options.
*/
function addClickEvent(){
    document.getElementById("stops").addEventListener("click", stops, true);
    document.getElementById("early").addEventListener("click", early, true);
    document.getElementById("flights").addEventListener("click", flights, true);
    document.getElementById("destinations").addEventListener("click", destinations, true);
    document.getElementById("carrier").addEventListener("click", carrier, true);
}

/*
Displays the flightid of the flight with the most stops.
*/
function stops() {
    document.getElementById("info").innerHTML = ""; // Clearing the info div

    var stopsMap = new Map();
    var fid = "";
    var stops = 0;

    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var json = JSON.parse(this.responseText);
        for(var i = 0; i < json.length; i++){
            var element = json[i];

            //Checks whether the element is a segement or not and gets the appropriate data.
            var id = element.id != undefined ? element.id : element.flightid;

            //Checks if the flight id has been seen before and if it has the value will be increased by 1.
            !stopsMap.has(id) ? stopsMap.set(id,1) : stopsMap.set(id,stopsMap.get(id) + 1);

        }
 
        //Loops through the stopsMap and individually checks each flightids stops.
        for (let [key, value] of stopsMap.entries()) {
          if(value > stops){
              fid = key;
              stops = value;
          }
        }

       //Displays the card with the appropriate data.
       displayCard(`Flight that had the most stops`,`Most stops`,`The flight with the id of  ${fid} fid had ${stops} stops.`);
       xhr.abort()
    }
    });

    xhr.open("GET", "http://localhost:25565/Flight/all/",true);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);

    
}

/*
Displays how many flights left before 12 in the morning (12AM)
*/
function early() {
    document.getElementById("info").innerHTML = ""; // Clearing the info div

    var times = 0; // Counter of how many flights leave before 12AM
    var xhr = new XMLHttpRequest();
    var data = null;
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var json = JSON.parse(this.responseText);

        for(var i = 0; i < json.length; i++){
            var element = json[i];
            //Checks whether the element is a segement or not and gets the appropriate data.
            var time = element.outdeparttime != undefined ? element.outdeparttime : element.deptime;

            //Checks if the time is before 12 and if it is then it will increment the counter.
            parseInt(time.split(":")[0],10) < 12 ? times++ : times;
            
        }

       //Displays the card with the appropriate data.
       displayCard("Early fliers","Flights",`There was a total of ${times} flights that left before 12AM`);
    }
    });

    xhr.open("GET", "http://localhost:25565/Flight/all/",true);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}

/*
Displays all dates that flights departed on and calculated how many flights left on that day.
*/
function flights() {
    document.getElementById("info").innerHTML = ""; // Clearing the info div

    var dateMap = new Map();
    var xhr = new XMLHttpRequest();
    var data = null;
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var json = JSON.parse(this.responseText);
        
        for(var i = 0; i < json.length; i++){
            var element = json[i];
            
            //Checks whether the element is a segment or not and gets the appropriate data.
            var outdate = element.outarrivaldate != undefined ? element.outarrivaldate : element.depdate;
            var indate = element.inarrivaldate != undefined ? element.inarrivaldate : element.arrdate;

            //Checks if the date is already logged and if it is, Then the counter will be incremented.
            dateMap.has(outdate.toLowerCase()) ? dateMap.set(outdate,dateMap.get(outdate.toLowerCase()) + 1) : dateMap.set(outdate.toLowerCase(),1);
            dateMap.has(indate.toLowerCase()) ? dateMap.set(indate,dateMap.get(indate.toLowerCase()) + 1) : dateMap.set(indate.toLowerCase(),1);
            
            //removes the blank date
            dateMap.delete("");

            //Output
            var info = "";
            for (let [key, value] of dateMap.entries()) {
                info = info + `Date: ${key} - ${value} Unique Flights<br>`;
            }
    
            
        }
        //Displays the card with the appropriate data.
        displayCard("Unique Flights","Flights",`<b>Unique Flight date and frequency date</b>:<br> ${info}`);
    }
    });

    xhr.open("GET", `http://localhost:25565/Flight/all`,true);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);

}

/*
Displays the most popular flight destination.
*/
function destinations() {
    document.getElementById("info").innerHTML = ""; // Clearing the info div

    var destinations = new Map();
    var max = 0;
    var destination;
    
    var xhr = new XMLHttpRequest();
    var data = null;
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var json = JSON.parse(this.responseText);

        for(var i = 0; i < json.length; i++){
            var element = json[i];
            if(element.destair != undefined){
                //This checks if the current destination being checked already exists in the map and if it does the counter will increase
                destinations.has(element.destair.toLowerCase()) ? destinations.set(element.destair.toLowerCase(),destinations.get(element.destair.toLowerCase()) + 1) : destinations.set(element.destair.toLowerCase(),1);
            } 
        }
        //This for loop is used to find the destination with the highest amount of flights to that location.
        for (let [key, value] of destinations.entries()) {
            if(value > max){
                max = value;
                destination = key;
            }
          }

        //Displays the card with the appropriate data.
       displayCard("Popular Destinations","Destination",`The most popular destination during the recoreded time was ${destination} with ${max} recorded flights to that location.`);
    }
    });

    xhr.open("GET", "http://localhost:25565/Flight/all/",true);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);

    
}

/* 
Displays the most popular carier 
*/
function carrier() {
    document.getElementById("info").innerHTML = ""; // Clearing the info div

    var carriers = new Map();
    var max = 0;
    var carrier;

    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var json = JSON.parse(this.responseText);

        for(var i = 0; i < json.length; i++){
            var element = json[i];
            if(element.carrier != undefined){
                //This checks if the current carrier being checked already exists in the map and if it does the counter will increase
                carriers.has(element.carrier.toLowerCase()) ? carriers.set(element.carrier.toLowerCase(),carriers.get(element.carrier.toLowerCase()) + 1) : carriers.set(element.carrier.toLowerCase(),1);
            }      
        }

        //This for loop is used to find the carrier with the most usage.
        for (let [key, value] of carriers.entries()) {
            if(value > max){
                max = value;
                carrier = key;
            }
        }

        //Displays the card with the appropriate data.
       displayCard("Popular Carriers","Flight Carriers",`The most popular flight carrier during the recoreded time was ${carrier} with ${max} recorded flights.`);
    }
    });

    xhr.open("GET", "http://localhost:25565/Flight/all/",true);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
}

/*
Displays a card using Bootstrap with appropriate data.
*/
function displayCard(header,title, message){
    document.getElementById("info").innerHTML = ``+
    `<div class="card"><div class="card-header">${header}</div>`+
    `<div class="card-body"><h5 class="card-title">${title}</h5><p class="card-text">${message}</p></div></div>`; 
}
