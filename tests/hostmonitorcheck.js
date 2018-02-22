
var HMStatus = require('../src/hostmonitorservice');
var conf = {hostMonitorURL: "http://hostmonitor.klm.com/index_blueweb.htm",
            timeout: 7000};
var service = new HMStatus(conf);

service.getMonitorStatus().then(function (result){
    console.log(result);
    }
);
 