var mosca = require('mosca');
var http = require('http');
const express = require('express')
const app = express()
const LOCAL_PORT = 3000

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  // url: process.env.DB_HOST || 'mongodb://localhost/mqtt?retryWrites=true&w=majority',
 // url: 'mongodb+srv://adminDB:epsilon1@cluster0.b7amm.mongodb.net/yai-commander?retryWrites=true&w=majority',
  url: 'mongodb+srv://adminDB:epsilon1@cluster0.b7amm.mongodb.net/yai-commander?retryWrites=true',
  pubsubCollection: 'clients',
  mongo: {}
};

httpServ = http.createServer();

var settings = {
  port: 1883,
  //host: "192.168.0.171",
  // backend: ascoltatore
};

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
*/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

var server_port = process.env.PORT || LOCAL_PORT;

app.listen(server_port, () => {
  console.log(`Example app listening on port ${server_port}`)
})

//var server_port = process.env.PORT || LOCAL_PORT;
//httpServ.listen(server_port, function() {
//    console.log('Listening on port %d', server_port);
//});



