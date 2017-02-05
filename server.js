var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//PIN CONFIG
//var Gpio = require('pigpio').Gpio;

activeStrips = ['strip1', 'strip2'];

LED_Strips = {
  strip1: {
    rPin: null,
    gPin: null,
    bPin: null,

    rgpio: null,
    ggpio: null,
    bgpio: null,
  },

  strip2: {
    rPin: null,
    gPin: null,
    bPin: null,

    rgpio: null,
    ggpio: null,
    bgpio: null,
  }
};

var setPinSettings = function (pinSettings) {
  LED_Strips.strip1.rPin = pinSettings.strip1.rPin;
  LED_Strips.strip1.rgpio = new Gpio(LED_Strips.strip1.rPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip1.gPin = pinSettings.strip1.gPin;
  LED_Strips.strip1.ggpio = new Gpio(LED_Strips.strip1.gPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip1.bPin = pinSettings.strip1.bPin;
  LED_Strips.strip1.bgpio = new Gpio(LED_Strips.strip1.bPin, { mode: Gpio.OUTPUT });
  
  LED_Strips.strip2.rPin = pinSettings.strip2.rPin;
  LED_Strips.strip2.rgpio = new Gpio(LED_Strips.strip2.rPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip2.gPin = pinSettings.strip2.gPin;
  LED_Strips.strip2.ggpio = new Gpio(LED_Strips.strip2.gPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip2.bPin = pinSettings.strip2.bPin;
  LED_Strips.strip2.bgpio = new Gpio(LED_Strips.strip2.bPin, { mode: Gpio.OUTPUT });
};
var pinSettings = {
  strip1: {
    rPin: 17,
    gPin: 18,
    bPin: 27,
  },
  strip2: {
    rPin: 22,
    gPin: 23,
    bPin: 24,
  }
};
//setPinSettings(pinSettings);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

io.on('connection', function(socket) {
  socket.on('change-pin-settings', function(pinSettings) {
    //setPinSettings(pinSettings);

    io.emit('change-pin-settings', pinSettings);
  });

  socket.on('change-active-strips', function(activeStrips) {
    activeStrips = activeStrips || ["strip1"];

    io.emit('change-active-strips', activeStrips);
  });

  socket.on('change-color', function(color) {
    color = color || {};

    console.log("r: " + color.r + "g: " + color.g + "b: " + color.b);

    // for (var i = 0; i < activeStrips.length; i++) {
    //     LED_Strips[activeStrips[i]].rgpio.pwmWrite(color.r);
    //     LED_Strips[activeStrips[i]].ggpio.pwmWrite(color.g);
    //     LED_Strips[activeStrips[i]].bgpio.pwmWrite(color.b);
    // }

    //io.emit('change-color', color);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
