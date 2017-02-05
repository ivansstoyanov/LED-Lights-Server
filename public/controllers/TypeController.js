App.controller('TypeController', ['$scope', 'socket', function($scope, socket) {
  
    socket.on('chat message', function (message) {
      $scope.testMessages = 'some message ' + message;
    });

    $scope.testClick = function(message) {
      socket.emit('chat message', message);
    };


    $scope.tab = 1;
    
    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };

    $scope.setColorMode = function(mode) {
      $scope.customSettings.control = mode;
    };

    $scope.isColorModeSet = function(tabNum) {
      return $scope.customSettings.control === tabNum;
    };


    $scope.customSettings = {
      control: 'hue', //hue, brightness, saturation, wheel
      theme: 'bootstrap',
      position: 'bottom left',
      inline: true,
      defaultValue: '#266ad1',
    };

    $scope.color = {
      hue: '#00AA00',
      brightness: '#FFFFFF',
      saturation: '#AAAAAA',
      wheel: '#336688',
      textfield: '#BBBBBB',
      hidden: '#121212',
      inline: '#555555',
      topleft: '#444444',
      topright: '#777777',
      bottomleft: '#888888',
      bottomright: '#191919',
      opacityHex: '#aabbaa',
      opacityVal: '1',
      opacityRgba: 'rgba(0,0,0,0.5)',
      lettercase: '#EEEEAA',
      random: '#000000',
      dynamic: '#CCCCCC'
      // formvalidation: '#EEEEAA'
    };
    //Objects for control types:
    //object for brightness
    $scope.brightnesssettings = {
      control: 'brightness'
    };

    //object for saturation
    $scope.saturationsettings = {
      control: 'saturation'
    };

    //object for wheel
    $scope.wheelsettings = {
      control: 'wheel'
    };


    //objects for input modes
    //inline textfield
    $scope.inlinesettings = {
      inline: true
    };

    //objects for positions
    $scope.topleftsettings = {
      position: 'top left'
    };

    $scope.toprightsettings  = {
      position: 'top right'
    };

    $scope.bottomrightsettings = {
      position: 'bottom right'
    };


    //objects for more
    $scope.opacitysettings = {
      opacity: true
    };

    $scope.lettercasesettings = {
      letterCase: 'uppercase'
    };

    $scope.dynamicSettings = {
      letterCase: 'uppercase'
    };

    $scope.changeLetterCase = function (letterCase) {
      $scope.dynamicSettings.letterCase = letterCase;
    };

    $scope.changePosition = function (pos) {
      $scope.dynamicSettings.position = pos;
    };

    $scope.randomColor = function () {
      $scope.color.random = getRandomColor();
    };

    var getRandomColor = function () {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    };

  }]);