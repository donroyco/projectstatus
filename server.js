var projectName = 'MYWP-MYWPD';
var socketPort = 8081;


var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(socketPort);
app.use(express.static('public'));		

var display = require('./display');

display.allOff();
var lastBambooStatus = 'unknown';
var lastServerStatus = 'unknown';

// process.exit(); 

// that was quick

var bambooStatusService = require('./bamboostatusservice');
var serverStatusService = require('./serverstatusservice');

var ticker = setInterval(function() {

	update();

}, 30000);

function update () {

	bambooStatusService.getBambooStatus(projectName)
	.then(processBambooStatus); 

	serverStatusService.getServerStatus()
	.then(processServerStatus); 
};

function processBambooStatus(bambooStatus) {

	var statusMessage = 'Status bamboo: ' + bambooStatus;
	console.log(statusMessage);

	//	io.sockets.emit('status', {value: statusMessage});	
	if (lastBambooStatus !== bambooStatus && bambooStatus.toLowerCase() === 'successful') {
		//display.ringBell();
		console.log('Go all disco');
		display.allDisco(bambooStatus);
	}
	lastBambooStatus = bambooStatus;
	display.setBambooStatus(bambooStatus);

	io.sockets.emit('lightBamboo', {value: bambooStatus});	
}

function processServerStatus(serverStatus) {

	var statusMessage = 'Status server: ' + serverStatus;
	console.log(statusMessage);

	lastServerStatus = bambooStatus;
	display.setHealthStatus(serverStatus);

	io.sockets.emit('lightBackend', {value: serverStatus});	
}

io.sockets.on('connection', function (socket) {
	socket.on('bamboo', function (data) {
		console.log("bamboo found " + data.value);
		processBambooStatus(data.value);
	}); 
	socket.on('backend', function (data) {
		console.log("backend found " + data.value);
		serverStatus = data.value;
	}); 
	socket.on('quitAll', function (data) {
		console.log("quitting");
		projectStatus.allOff();
		
		io.sockets.emit('allOff', '');	
		server.close();	
		process.exit();
	});
	
});

console.log("running");
update();
