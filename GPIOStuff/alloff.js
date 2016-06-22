var which = process.argv.slice(2)[0];
var what = process.argv.slice(2)[1];
console.log(which, what);

var Gpio = require('onoff').Gpio,
    port1 = new Gpio(20, 'out'),
    port2 = new Gpio(21, 'out'),
    port3 = new Gpio(22, 'out'),
    port4 = new Gpio(23, 'out'),
    port5 = new Gpio(24, 'out'),
    port6 = new Gpio(25, 'out'),
    port7 = new Gpio(26, 'out'),
    port8 = new Gpio(27, 'out');

port1.writeSync(0);  // Turn LED off.
port1.unexport();    // Unexport GPIO and free resources
port2.writeSync(0);
port2.unexport();
port3.writeSync(0);                 
port3.unexport();  
port4.writeSync(0);                 
port4.unexport();  
port5.writeSync(0);                 
port5.unexport();  
port6.writeSync(0);                 
port6.unexport();  
port7.writeSync(0);                 
port7.unexport();  
port8.writeSync(0);                 
port8.unexport();  

