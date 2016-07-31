// Config

var projectName = 'MYWP-MYWPD';
var socketPort = 8081;

var tickTimeSeconds = 30;
var startAt = '07:30'; // Preceding zero
var endAt = '18:30';

// Dependencies

var express = require('express');
app = express();
server = require('http').createServer(app);

var io = require('socket.io').listen(server);
server.listen(socketPort);
app.use(express.static('public'));		

// Configuration
var nconf = require('nconf');
nconf.argv()
   .env()
   .file({ file: 'config-mywp.json' })
   .load();


io.sockets.emit('heading1', 'Health status for ' + nconf.get('projectname'));


var display = require('./display');
display.init(nconf.get('config'));

display.allOff();

var Speaker = require('./speaker');
var speaker = new Speaker(nconf.get('config'));

var isAllOff = false;
var overruleOfficeHours = false;

var lastBambooStatus = 'unknown';
var lastHealthStatus = 'unknown';

var BambooStatus = require('./bamboostatusservice');
var bambooStatusService = new BambooStatus(nconf.get('projectname'));
var HealthStatus = require('./healthstatusservice');
var healthStatusService = new HealthStatus(nconf.get('config'));

// Process ticks...
var ticker = setInterval(function() {

	update();

}, tickTimeSeconds * 1000);

function update() {

	io.sockets.emit('generalInfo', 'Checking Project Status');	
	io.sockets.emit('heading1', 'Health status for ' + nconf.get('projectname'));
	
	if (inOfficeHours()) {
		if (isAllOff) {
			isAllOff = false;
			console.log('Starting within office hours');
		}

		bambooStatusService.getBambooStatus(projectName)
		.then(processBambooStatus); 

		healthStatusService.getHealthStatus()
		.then(processHealthStatus); 

	} else {

		if (!isAllOff) {
			display.allOff();
			isAllOff = true;
			console.log('After office hours');
			var curtime = new Date().toISOString().slice(0,16).replace('T', ' ');
			console.log('Since i think its' , curtime);
			io.sockets.emit('generalInfo', 'Outside Office Hours, ' + curtime);	
		}
	}

};

function inOfficeHours() {
	if (overruleOfficeHours === true) {
		io.sockets.emit('generalInfo', 'Office Hours overruled');
		return true;
	}
 
	var time = new Date();
    var currTime = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
	//console.log(currTime, startAt, endAt);
	var isTimeOK = currTime >= startAt && currTime <= endAt;

	var isWeekend = time.getDay() === 7 || time.getDay() === 0;

	return isTimeOK && !isWeekend;
}

function processBambooStatus(bambooStatus) {

	if (lastBambooStatus !== bambooStatus.value && bambooStatus.value.toLowerCase() === 'failed') {
		display.buzz();
		// Speak about buildbreaker and stroepiewaffels here
	}
	lastBambooStatus = bambooStatus.value;
	display.setBambooStatus(bambooStatus.value);

	io.sockets.emit('lightBamboo', bambooStatus);	
}

function processHealthStatus(healthStatus) {

	lastHealthStatus = healthStatus.value;
	display.setHealthStatus(healthStatus.value);

	io.sockets.emit('lightHealth', healthStatus);	
}

io.sockets.on('connection', function (socket) {

	socket.on('evtBamboo', function (data) {
		processBambooStatus(data);
	}); 

	socket.on('evtHealth', function (data) {
		processHealthStatus(data);
	}); 

	socket.on('updateNow', function (data) {
		var wasOverruled = overruleOfficeHours;
		overruleOfficeHours = true;
		update();
		overruleOfficeHours = wasOverruled;
	}); 

	socket.on('allDisco', function (data) {
		display.allDisco();
	}); 

	socket.on('aBuzz', function (data) {
		display.buzz();
	}); 

	socket.on('sayText', function (data) {
		speaker.say(data);
	}); 

	socket.on('officeHours', function (data) {
		console.log('office hours overruled: ', data);
		overruleOfficeHours = data;
		update();
	}); 

	socket.on('quitAll', function (data) {
		console.log("quitting");
		display.allOff();
		
		io.sockets.emit('allOff', '');	
		server.close();	
		process.exit();
	});
	
});

console.log("Healthcheck for project: ", nconf.get('projectname'));
display.buzz();
speaker.say('hello world');
update();
