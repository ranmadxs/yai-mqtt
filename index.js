var http = require('http');
const express = require('express');
const app = express()
const LOCAL_PORT = 3000
var pjson = require('./package.json');
var mqtt    = require('mqtt');
var last_Message = {};
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



//var httpServer = https.createServer(options, app); 
var httpServer = http.createServer({server: app}); 

var mqttClient  = mqtt.connect("mqtt://broker.hivemq.com", mqttOptions);
mqttClient.on("connect",function(){	
  //console.log(`mqtt ${mqttOptions.clientId} connected_v4`);
  mqttClient.subscribe(mqttTopics.MQTT_TOPIC_OUT);
});
mqttClient.on('message', async function (topic, message) {
  try {
    // message is Buffer
    console.log(message.toString());
    jsonObj = JSON.parse(message);
    last_Message = jsonObj;
    //console.log(jsonObj["type"]);
    if(String(jsonObj["type"]) == "YAI_TANK_HEIGHT"){
      //console.log("XD5555::"+jsonObj["distance"]);
      //setHight(jsonObj["height"]);
      //updateLookupTableValue(jsonObj["volume"]);
      //updateChangeRateValue(jsonObj["water_flow"]);
    }
  } catch (error) {
    console.error("Error reading mqtt topic");
    console.error(error);
  }

});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

app.get('/', (req, res) => {
  res.render("index", {
    'YAI_VERSION' : pjson.version,
    'YAI_UID': "YAI_UID"
  });
})

app.get('/tanklevel', (req, res) => {
  res.json(last_Message);
})

app.use(express.static('static'))
var server_port = process.env.PORT || LOCAL_PORT;

app.listen(server_port, () => {
  console.log(`Mqtt::http ${pjson.version} listening on port ${server_port}`);
});
