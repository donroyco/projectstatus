// Config

var projectName = 'MYWP-MYWPD';
var socketPort = 8082;

var tickTimeSeconds = 30;
var startAt = '07:30'; // Preceding zero
var endAt = '16:30';

// Dependencies

var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(socketPort);
app.use(express.static('public'));		

var display = require('./display');

display.allOff();
var isAllOff = false;

var lastBambooStatus = 'unknown';
var lastServerStatus = 'unknown';

var bambooStatusService = require('./bamboostatusservice');
var serverStatusService = require('./serverstatusservice');


var ticker = setInterval(function() {

	update();

}, tickTimeSeconds * 1000);

function update () {

	if (inOfficeHours()) {
		if (isAllOff) {
			isAllOff = false;
			console.log('Starting within office hours');
		}

		bambooStatusService.getBambooStatus(projectName)
		.then(processBambooStatus); 

		serverStatusService.getServerStatus()
		.then(processServerStatus); 

	} else {

		if (!isAllOff) {
			display.allOff();
			isAllOff = true;
			console.log('After office hours');
		}
	}
};

function inOfficeHours() {
	var time = new Date();
    var currTime = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
	//console.log(currTime, startAt, endAt);

	return currTime >= startAt && currTime <= endAt;
}

function processBambooStatus(bambooStatus) {

	var statusMessage = 'Status bamboo: ' + bambooStatus.value;
	//console.log(statusMessage);

	//	io.sockets.emit('status', {value: statusMessage});	
	if (lastBambooStatus !== bambooStatus.value && bambooStatus.value.toLowerCase() === 'successful') {
		//display.ringBell();
		display.allDisco(bambooStatus.value);
	}
	lastBambooStatus = bambooStatus.value;
	display.setBambooStatus(bambooStatus.value);

	io.sockets.emit('lightBamboo', bambooStatus);	
}

function processServerStatus(serverStatus) {

	var statusMessage = 'Status server: ' + serverStatus.value;
	//console.log(statusMessage);

	lastServerStatus = serverStatus.value;
	display.setHealthStatus(serverStatus.value);

	io.sockets.emit('lightBackend', serverStatus);	
}

io.sockets.on('connection', function (socket) {

	socket.on('bamboo', function (data) {
		//console.log("bamboo found " + data.value);
		processBambooStatus(data);
	}); 

	socket.on('backend', function (data) {
		//console.log("backend found " + data.value);
		processServerStatus(data);
	}); 

	socket.on('allDisco', function (data) {
		display.allDisco(lastBambooStatus);
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
