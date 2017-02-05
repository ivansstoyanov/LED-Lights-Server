App.controller('TypeController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorConvert) {

    socket.on('chat message', function (message) {
      $scope.testMessages = 'some message ' + message;
    });


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
      position: 'bottom left', // first top/bottom then left/right
      inline: true,
      //opacity: true,
      //letterCase: 'uppercase' //lowercase
    };

    $scope.$watch('color.colorSet', function() {
        socket.emit('change-color', colorConvert.hexToRgb($scope.color.colorSet));
    });

    $scope.color = {
      colorSet: '#266ad1',
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