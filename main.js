var express = require('express');
app = express();
server = require('http').createServer(app);
var Gpio = require('onoff').Gpio,
    ports = [new Gpio(20, 'out'),
             new Gpio(21, 'out'),
             new Gpio(22, 'out'),
             new Gpio(23, 'out'),
             new Gpio(24, 'out'),
             new Gpio(25, 'out'),
             new Gpio(26, 'out')];

var blinker = new Gpio(27,'out');

io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static('public'));		

var bambooStatus = 'unknown';
var serverStatus = 'unknown';

var ticker = setInterval(function() {
	var statusMessage = 'bamboo: ' + 
			    bambooStatus + 
                            ' server: ' + 
                            serverStatus;
	console.log(statusMessage);
	io.sockets.emit('status', {value: statusMessage});	

	blinker.writeSync(1);
	setTimeout(function() {
		// blinker.writeSync(0)
	} , 800);

	if (bambooStatus === 'ok') {
		ports[0].writeSync(0);
		ports[1].writeSync(1);
		ports[2].writeSync(0);
	}
	if (bambooStatus === 'building') {
		ports[0].writeSync(0);
		ports[1].writeSync(0);
		ports[2].writeSync(1);
	}
	if (bambooStatus === 'failed') {
		ports[0].writeSync(1);
		ports[1].writeSync(0);
		ports[2].writeSync(0);
	}
	if (serverStatus === 'up') {
		ports[3].writeSync(0);
		ports[4].writeSync(1);
		ports[5].writeSync(0);
	}
	if (serverStatus === 'shaky') {
		ports[3].writeSync(1);
		ports[4].writeSync(1);
		ports[5].writeSync(0);
	}
	if (serverStatus === 'down') {
		ports[3].writeSync(1);
		ports[4].writeSync(0);
		ports[5].writeSync(0);
	}

}, 5000);

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
		clearInterval(ticker);
		ports.forEach(function(port) {port.writeSync(0)});
		
		io.sockets.emit('led', {value: 'off'});	
		process.exit();
	});
	
	socket.emit('status', {value: 'listening'});
});

console.log("running");