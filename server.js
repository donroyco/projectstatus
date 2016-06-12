var projectName = 'MYWP-MYWPD';
var socketPort = 8081;


var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(socketPort);
app.use(express.static('public'));		

var projectStatus = require('./projectstatus');

projectStatus.allOff();

// process.exit(); 

// that was quick

var bambooStatusService = require('./bamboostatus');

var bambooStatus = 'unknown';
var serverStatus = 'unknown';

var ticker = setInterval(function() {

	update();

}, 15000);


function update () {

	bambooStatus = bambooStatusService.getBambooStatus(projectName);
	console.log(bambooStatus, ' via interface');

	var statusMessage = 'bamboo: ' + 
			    bambooStatus + 
                        ' health: ' + 
                        serverStatus;
	console.log(statusMessage);
//	io.sockets.emit('status', {value: statusMessage});	

	projectStatus.setBambooStatus(bambooStatus);
	if (bambooStatus === 'failed' || serverStatus === 'down') {
		//projectStatus.ringBell();
	}
	projectStatus.setHealthStatus(serverStatus);

	io.sockets.emit('lightBamboo', {value: bambooStatus});	
	io.sockets.emit('lightBackend', {value: serverStatus});	
};


io.sockets.on('connection', function (socket) {
	socket.on('bamboo', function (data) {
		console.log("bamboo found " + data.value);
		bambooStatus = data.value;
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
