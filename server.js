var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(8080);
app.use(express.static('public'));		

var projectStatus = require('./projectstatus');

var bambooStatusService = require('./bamboostatus');

var bambooStatus = 'unknown';
var serverStatus = 'unknown';

var ticker = setInterval(function() {

	update();

}, 20000);


function update () {

	bambooStatus = bambooStatusService.getBambooStatus();

	var statusMessage = 'bamboo: ' + 
			    		bambooStatus + 
                        ' health: ' + 
                        serverStatus;
	console.log(statusMessage);
	io.sockets.emit('status', {value: statusMessage});	

	projectStatus.setBambooStatus(bambooStatus);
	if (bambooStatus === 'failed' || serverStatus === 'down') {
		//projectStatus.ringBell();
	}
	projectStatus.setHealthStatus(serverStatus);
};


io.sockets.on('connection', function (socket) {
	socket.on('bamboo', function (data) {
		console.log("bamboo found " + data.value);
		bambooStatus = data.value;
		//io.sockets.emit('status', {value: 'bamboo status changed'});	
	}); 
	socket.on('backend', function (data) {
		console.log("backend found " + data.value);
		serverStatus = data.value;
		//io.sockets.emit('status', {value: 'backend status changed'});	
	}); 
	socket.on('quitAll', function (data) {
		console.log("quitting");
		projectStatus.allOff();
		
		io.sockets.emit('led', {value: 'off'});	
		process.exit();
	});
	
	socket.emit('status', {value: 'listening'});
});

console.log("running");
update();
