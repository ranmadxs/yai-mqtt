var mosca = require('mosca');
var http = require('http');


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
  // backend: ascoltatore
};

let mqttServer = new mosca.Server(settings);

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

httpServ.listen(process.env.PORT || 8080);

