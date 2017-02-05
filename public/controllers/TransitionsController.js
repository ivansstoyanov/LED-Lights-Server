App.controller('TransitionsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    $scope.setColorMode = function(mode) {
      $scope.defaultSettings.control = mode;
    };

    $scope.isColorModeSet = function(tabNum) {
      return $scope.defaultSettings.control === tabNum;
    };

    $scope.defaultColor = colorManager.getRandomColor();
    $scope.defaultSettings = {
      control: 'saturation', //hue, brightness, saturation, wheel
      theme: 'bootstrap',
    };
    $scope.createdTransitions = [];

    $scope.addTransition = function () {
      $scope.createdTransitions.push({
        colorSet: colorManager.getRandomColor()
      });
    }

    $scope.removeTransition = function () {
      $scope.createdTransitions.pop();
    }

    // $scope.$watch('color.colorSet', function() {
    //     socket.emit('change-color', colorManager.hexToRgb($scope.color.colorSet));
    // });

    // $scope.color = {
    //   colorSet: '#266ad1',
    // };
  }]);