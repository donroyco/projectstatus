var projectName = 'MYWP-MYWPD';
var socketPort = 8081;


var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(socketPort);
app.use(express.static('public'));		

var projectStatus = require('./display');

projectStatus.allOff();

// process.exit(); 

// that was quick

var bambooStatusService = require('./bamboostatus');
var serverStatusService = require('./serverstatus');

//var bambooStatus = 'unknown';
var serverStatus = 'unknown';

var ticker = setInterval(function() {

	update();

}, 15000);

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
	projectStatus.setBambooStatus(bambooStatus);
	if (bambooStatus === 'failed' || serverStatus === 'down') {
		//projectStatus.ringBell();
	}

	io.sockets.emit('lightBamboo', {value: bambooStatus});	
}

function processServerStatus(serverStatus) {

	var statusMessage = 'Status server: ' + serverStatus;
	console.log(statusMessage);

	projectStatus.setHealthStatus(serverStatus);

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
	
	socket.emit('status', {value: 'listening'});
});

console.log("running");
update();
