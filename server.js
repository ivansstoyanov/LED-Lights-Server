PI = false;

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

process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) {
      var obj = {
        time: new Date().toLocaleString(),
        err: err,
        errStack: err.stack,
        errMessage: err.message
      }

      Database.save('errors', obj);
    }
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true})); //do something when app is closing
process.on('SIGINT', exitHandler.bind(null, {exit:true})); //catches ctrl+c event
process.on('uncaughtException', exitHandler.bind(null, {exit:true})); //catches uncaught exceptions

///////Database Setup
/////////////////////
var dbPath = 'database';
if (PI) {
  dbPath = '/home/pi/ledServer/LED-Lights-Server/database';
}
db = db.connect(dbPath, [
    'settings',
    'transitions',
    'effects',
    'errors'
]);

Database = {
    getSettings: function () {
        return db.settings.find()[0];
    },
    getTransitions: function () {
        return db.transitions.find();
    },
    getTransitionByName: function (name) {
      return db.transitions.findOne({name : name});
    },
    getEffects: function () {
        return db.effects.find();
    },
    getEffectByName: function (name) {
      return db.effects.findOne({name : name});
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
var Gpio = null;
if (PI) {
  Gpio = require('pigpio').Gpio;
}

activeStrips = ['strip1', 'strip2'];

LED_Strips = {
  strip1: {
    rPin: null,    gPin: null,    bPin: null,
    rgpio: null,    ggpio: null,    bgpio: null
  },
  strip2: {
    rPin: null,    gPin: null,    bPin: null,
    rgpio: null,    ggpio: null,    bgpio: null
  }
};

var setPinSettings = function () {
  var pinSettings = Database.getSettings();

  LED_Strips.strip1.rPin = pinSettings.strip1.rPin;
  LED_Strips.strip1.gPin = pinSettings.strip1.gPin;
  LED_Strips.strip1.bPin = pinSettings.strip1.bPin;
  
  LED_Strips.strip2.rPin = pinSettings.strip2.rPin;
  LED_Strips.strip2.gPin = pinSettings.strip2.gPin;
  LED_Strips.strip2.bPin = pinSettings.strip2.bPin;

  if (PI) {
    LED_Strips.strip1.rgpio = new Gpio(LED_Strips.strip1.rPin, { mode: Gpio.OUTPUT });
    LED_Strips.strip1.ggpio = new Gpio(LED_Strips.strip1.gPin, { mode: Gpio.OUTPUT });
    LED_Strips.strip1.bgpio = new Gpio(LED_Strips.strip1.bPin, { mode: Gpio.OUTPUT });
    
    LED_Strips.strip2.rgpio = new Gpio(LED_Strips.strip2.rPin, { mode: Gpio.OUTPUT });
    LED_Strips.strip2.ggpio = new Gpio(LED_Strips.strip2.gPin, { mode: Gpio.OUTPUT });
    LED_Strips.strip2.bgpio = new Gpio(LED_Strips.strip2.bPin, { mode: Gpio.OUTPUT });
  }
};
setPinSettings();

var SetLedColor = function (color) {
  for (var i = 0; i < activeStrips.length; i++) {
      try {
        LED_Strips[activeStrips[i]].rgpio.pwmWrite(color.r);
        LED_Strips[activeStrips[i]].ggpio.pwmWrite(color.g);
        LED_Strips[activeStrips[i]].bgpio.pwmWrite(color.b);
      } catch (err) {
        //error when setting some colors
      }
  }
}

if (!PI) {
  SetLedColor = function () {};
}

///////Socket IO Configuration
//////////////////////////////
io.on('connection', function(socket) {
  // socket.on('change-pin-settings', function(pinSettings) {
  //   //setPinSettings(pinSettings);

  //   io.emit('change-pin-settings', pinSettings);
  // });

  // socket.on('change-active-strips', function(activeStrips) {
  //   activeStrips = activeStrips || ["strip1"];

  //   io.emit('change-active-strips', activeStrips);
  // });

  socket.on('start', function(name) {
    transitionService.start();
  });
  socket.on('stop', function(name) {
    transitionService.stop();
  });

  socket.on('change-color', function(color) {
    color = color || {};

    //console.log("r: " + color.r + "g: " + color.g + "b: " + color.b);
    SetLedColor(color);
  });

  socket.on('test-effect', function(data) {
    var allTransitions = [];

    for (var i = 0; i < data.data.length; i++) {
      var transition = Database.getTransitionByName(data.data[i].name);

      allTransitions.push({
        name: transition.name,
        data: transition.data,
        refresh: data.data[i].refresh
      });
    }

    transitionService.setup(allTransitions, SetLedColor);
    transitionService.start();
  });

  socket.on('start-effect', function(name) {
    var result = Database.getEffectByName(name);
    var allTransitions = [];

    for (var i = 0; i < result.data.length; i++) {
      var transition = Database.getTransitionByName(result.data[i].name);

      allTransitions.push({
        name: transition.name,
        data: transition.data,
        refresh: result.data[i].refresh
      });
    }

    transitionService.setup(allTransitions, SetLedColor);
    transitionService.start();
  });

  socket.on('start-transition', function(name) {
    var result = Database.getTransitionByName(name);

    transitionService.setup([{
      name: 'test',
      data: result.data,
      refresh: 1000
    }], SetLedColor);
    transitionService.start();
  });

  socket.on('test-transition', function(colorTransitions) {
    transitionService.setup([{
      name: 'test',
      data: colorTransitions,
      refresh: 3
    }], SetLedColor);
    transitionService.start();
  });

  socket.on('save-transition', function(data) {
    var result = Database.save('transitions', data);

    io.emit('save-transition-done', result);
  });

  socket.on('save-effect', function(data) {
    var result = Database.save('effects', data);

    io.emit('save-effect-done', result);
  });

  socket.on('refresh-transitions', function(data) {
    var result = Database.getTransitions();

    io.emit('refresh-transitions', result);
  });

  socket.on('refresh-effects', function(data) {
    var result = Database.getEffects();

    io.emit('refresh-effects', result);
  });
  
});

///////Application Start
////////////////////////
http.listen(3000, function(){
  console.log('listening on *:3000');

  if(PI) {
    var result = Database.getTransitionByName('helloPi');

    transitionService.setup([{
      name: 'hello',
      data: result.data,
      refresh: 3
    }], SetLedColor);
    transitionService.start();
  }
});
