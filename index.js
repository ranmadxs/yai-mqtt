var mosca = require('mosca');
var http = require('http');
const express = require('express');
var engine = require('consolidate');
const app = express()
const LOCAL_PORT = 3000
var pjson = require('./package.json');
var mqtt    = require('mqtt');
var mqttOptions = {
  clientId:"mqttjs01",
  username: 'test',
  password: 'test'
}

var mqttTopics = {
  'MQTT_TOPIC_IN': 'yai-mqtt/in',
  'MQTT_TOPIC_ALL': 'yai-mqtt/#',
  'MQTT_TOPIC_OUT': 'yai-mqtt/out'
}
//const enableWs = require('express-ws')
//enableWs(app)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const WebSocketClient = require('websocket').client;

var wsClient = new WebSocketClient();
wsClient.connect('ws://localhost:8080/', 'echo-protocol');

//console.log(wsClient);
wsClient.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});
wsClient.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
      console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log("Received: '" + message.utf8Data + "'");
      }
  });
  
});

var mqttClient  = mqtt.connect("mqtt://broker.hivemq.com", mqttOptions);
mqttClient.on("connect",function(){	
  console.log(`mqtt ${mqttOptions.clientId} connected_v2`);
  mqttClient.subscribe(mqttTopics.MQTT_TOPIC_OUT);
});

wss.on('connection',  (ws) => {
  console.info("websocket connection open");
  ws.on('error', console.error);

  mqttClient.on('message', async function (topic, message) {
    // message is Buffer
    //console.log(message.toString());
    //wss.handleUpgrade( (ws) => {
    ws.send(message.toString());
    //}); 
    //wsClient.send("XDDD"); 
    jsonObj = JSON.parse(message);
    //console.log(jsonObj["type"]);
    if(String(jsonObj["type"]) == "YAI_TANK_HEIGHT"){
      //console.log("XD5555::"+jsonObj["distance"]);
      //setHight(jsonObj["height"]);
      //updateLookupTableValue(jsonObj["volume"]);
      //updateChangeRateValue(jsonObj["water_flow"]);
    }
  
  });
});

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  // url: process.env.DB_HOST || 'mongodb://localhost/mqtt?retryWrites=true&w=majority',
 // url: 'mongodb+srv://adminDB:epsilon1@cluster0.b7amm.mongodb.net/yai-commander?retryWrites=true&w=majority',
  url: 'mongodb+srv://adminDB:epsilon1@cluster0.b7amm.mongodb.net/yai-commander?retryWrites=true',
  pubsubCollection: 'clients',
  mongo: {}
};
//const char* MQTT_TOPIC_IN = "yai-mqtt/in"; //IN
//const char* MQTT_TOPIC_ALL = "yai-mqtt/#"; //IN
//const char* MQTT_TOPIC_OUT = "yai-mqtt/out";

//const char* MQTT_SERVER = "192.168.0.179";
//const char* MQTT_SERVER = "broker.hivemq.com";//"broker.hivemq.com";//
//const u_int16_t MQTT_PORT = 1883; //1883





//httpServ = http.createServer();

/*
var settings = {
  port: 1883,
  //host: "192.168.0.171",
  // backend: ascoltatore
};
*/
/*let mqttServer = new mosca.Server(settings);

mqttServer.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
mqttServer.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

mqttServer.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

mqttServer.attachHttpServer(httpServ);
app.get('/', (req, res) => {
  res.send('Hello World!');
})
*/
var httpServer = http.createServer(app); 
app.engine('html', require('ejs').renderFile);
//app.engine('html', engine.mustache);
//app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

//app.set('view engine', 'html');
app.get('/', (req, res) => {
  //res.send('Hello World!');
  res.render("index", {
    'YAI_VERSION' : pjson.version,
    'YAI_UID': "YAI_UID"
  });
})

app.use(express.static('static'))
var server_port = process.env.PORT || LOCAL_PORT;

httpServer.listen(server_port, () => {
  console.log(`Mqtt ${pjson.version} listening on port ${server_port}`);
});

/*
const wss = new WebSocket.Server({ port: 8080 });
*/
/*
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('connection', function connection(con) {
    console.log('new client');
    ws.send("new client");
  });

  ws.on('open', function open() {
    console.log('ws [OK]');
    ws.send("ws Ok");
  });  

  ws.on('message', function newMsg(msg){
    console.log(msg);
  });

});
*/
//var server_port = process.env.PORT || LOCAL_PORT;
//httpServ.listen(server_port, function() {
//    console.log('Listening on port %d', server_port);
//});



