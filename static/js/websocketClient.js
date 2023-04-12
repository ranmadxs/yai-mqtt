var counterDiv = document.getElementById('counterDiv');
var wsCallbacks = [];
var logCountTotal = 150;
var logCount = 0;
function addWSCallback(funcionCall){
  wsCallbacks.push(funcionCall);
}
/*
function updateCounterUI(counter)
{
	counterDiv.innerHTML = counter; 
}
*/

function processMessage(data){
  wsCallbacks.forEach(callback => {
    //console.log('call: ', e.data);
    callback(data);
  });
  logCount++;
  if(logCount > logCountTotal){
    //$("#counterDiv").empty();
    $("#counterDiv p").slice(10).remove();
    logCount = 0;
  }
  var currentDate = new Date();
  var dateStr =
  //  ("00" + (currentDate.getMonth() + 1)).slice(-2) + "/" +
  //  ("00" + currentDate.getDate()).slice(-2) + "/" +
  //  currentDate.getFullYear() + " " +
    ("00" + currentDate.getHours()).slice(-2) + ":" +
    ("00" + currentDate.getMinutes()).slice(-2) + ":" +
    ("00" + currentDate.getSeconds()).slice(-2);    
    $("#counterDiv").prepend("<p><b>"+dateStr + "</b> | " + JSON.stringify(data) + "</p>");
}


function sucessdata(data) {
  console.log(data);
  processMessage(data);
}

function pooldata() {
  $.ajax({
    dataType: "json",
    url: "/tanklevel",
    success: sucessdata
  }).done(function() {
    //console.log("XDDDDDD34");
  });
}

$( document ).ready(function() {
  console.log( "wsClient init3!" );

  setInterval(pooldata, 1000);

  var connection = new WebSocket('ws://' + location.hostname + ':3000/', ['arduino']);
  $("#clearBtn").click(function(){
    $("#counterDiv").empty();
    console.log("clear logs");
  });
  connection.onopen = function () {
    console.log('Connected: ');
    $("#counterDiv").prepend("WS Connected [OK]</br>");
    // Ejemplo 1, peticion desde cliente
    //(function scheduleRequest() {
    //	connection.send("");
    //	setTimeout(scheduleRequest, 100);
    //})();
  };
  
  connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
  };
  
  connection.onmessage = function (e) {
    //updateCounterUI(e.data);
    console.log('Server: ', e.data);
    jsonObj = JSON.parse(e.data);
    processMessage(jsonObj);
  };
  
  connection.onclose = function () {
    console.log('WebSocket connection closed');
    $("#counterDiv").prepend("WS connection closed</br>");
  };
});

