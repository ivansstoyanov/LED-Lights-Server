var express = require('express');
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('diskdb');
var transitionService = require( __dirname + '/services/transitionService.js');

///////Application Configuration
////////////////////////////////
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/database', express.static(__dirname + '/database'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

///////Database Setup
/////////////////////
db = db.connect('database', [
    'settings',
    'transitions',
    'effects'
]);

Database = {
    getSettings: function () {
        return db.settings.find()[0];
    },
    getTransitions: function () {
        return db.transitions.find();
    },
    getEffects: function () {
        return db.effects.find();
    },
    save: function (type, data) {
      var result = 'done';
      var effect = db[type].find();

      effect.forEach(function(element) {
        if (data.name == element.name) {
          result = 'duplicate name';
        }
      }, this);

      if (result == 'done') {
        db[type].save(data);
      } 

      return result;
    },
};


///////API Setup
////////////////
app.use('/api', router);

router.get('/settings', function(req, res) {
  var pinSettings = Database.getSettings();

  res.json(pinSettings);
});

router.get('/templates', function(req, res) {
  var templates = Database.getTemplates();

  res.json(templates);
});

///////Strip PIN Configuration
//////////////////////////////
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

var setPinSettings = function () {
  var pinSettings = Database.getSettings();

  LED_Strips.strip1.rPin = pinSettings.strip1.rPin;
  //LED_Strips.strip1.rgpio = new Gpio(LED_Strips.strip1.rPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip1.gPin = pinSettings.strip1.gPin;
  //LED_Strips.strip1.ggpio = new Gpio(LED_Strips.strip1.gPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip1.bPin = pinSettings.strip1.bPin;
  //LED_Strips.strip1.bgpio = new Gpio(LED_Strips.strip1.bPin, { mode: Gpio.OUTPUT });
  
  LED_Strips.strip2.rPin = pinSettings.strip2.rPin;
  //LED_Strips.strip2.rgpio = new Gpio(LED_Strips.strip2.rPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip2.gPin = pinSettings.strip2.gPin;
  //LED_Strips.strip2.ggpio = new Gpio(LED_Strips.strip2.gPin, { mode: Gpio.OUTPUT });
  LED_Strips.strip2.bPin = pinSettings.strip2.bPin;
  //LED_Strips.strip2.bgpio = new Gpio(LED_Strips.strip2.bPin, { mode: Gpio.OUTPUT });
};
setPinSettings();

var SetLedColor = function (color) {
  for (var i = 0; i < activeStrips.length; i++) {
      LED_Strips[activeStrips[i]].rgpio.pwmWrite(color.r);
      LED_Strips[activeStrips[i]].ggpio.pwmWrite(color.g);
      LED_Strips[activeStrips[i]].bgpio.pwmWrite(color.b);
  }
}

SetLedColor = function () {};

///////Socket IO Configuration
//////////////////////////////
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
    //SetLedColor(color);

    //io.emit('change-color', color);
  });

  socket.on('test-transition', function(colorTransitions) {
    colorTransitions = colorTransitions || {};

    if (colorTransitions.length < 2) {
      return;
    }

    transitionService.setup(colorTransitions, SetLedColor);
    transitionService.start();

    //io.emit('change-color', color);
  });

  socket.on('save-transition', function(data) {
    var result = Database.save('transitions', data);

    io.emit('save-transition-done', result);
  });

  socket.on('save-effect', function(data) {
    var result = Database.save('effects', data);

    io.emit('save-effect-done', result);
  });
  
});

///////Application Start
////////////////////////
http.listen(3000, function(){
  console.log('listening on *:3000');
});
