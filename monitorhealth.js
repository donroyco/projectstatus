// Config
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
var defaultConfig = './config/projectstatus-config.json';
if (process.argv.length === 3) {
	defaultConfig = './config/' + process.argv[2] + '.json';
};
var nconf = require('nconf');
nconf.argv()
   .env()
   .file({ file: defaultConfig })
   .load();

var config = nconf.get('config');
var projectName =config.projectname;

io.sockets.emit('heading1', 'Health status for {projectName}');

var display = require('./src/display');
display.init(config);

display.allOff();

var Speaker = require('./src/speaker');
var speaker = new Speaker(config);

var AudioService = require('./src/audioservice');
var audioService = new AudioService();

var isAllOff = false;
var overruleOfficeHours = config.overruleOfficeHours || false;

var lastBambooStatus = 'unknown';
var lastHealthStatus = 'unknown';

var BambooStatus = require('./src/bambooprojectstatusservice');
var bambooStatusService = new BambooStatus(config);
//var BambooStatus = require('./bamboostatusservice');
//var bambooStatusService = new BambooStatus(nconf.get('projectname'));
var HealthStatus = require('./src/healthstatusservice');
var healthStatusService = new HealthStatus(config);

// Process ticks...
var ticker = setInterval(function() {

	update();

}, tickTimeSeconds * 1000);

function update() {

	io.sockets.emit('generalInfo', 'Checking Project Status');	
	io.sockets.emit('heading1', 'Health status for ' + projectName);
	
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

function processBambooStatus(bamboo) {
	console.log(bamboo);
	if (lastBambooStatus !== bamboo.status && bamboo.status.indexOf('failed') !== -1) {
		console.log('buzzing');
		display.buzz();
	}
	lastBambooStatus = bamboo.status;
	display.setBambooStatus(bamboo.status);

	io.sockets.emit('lightBamboo', bamboo);	
	io.sockets.emit('buildstatus', bamboo.planstatus);	
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

	socket.on('audioRequest', function (data) {
		audioService.play(data.what);
	}); 

	socket.on('sayText', function (data) {
		if (data.voice) {
			speaker.say(data.value, data.voice);
		} else {
			speaker.say(data.value);
		}
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
speaker.say('Hello, my name is Bluey');
display.buzz();

update();
