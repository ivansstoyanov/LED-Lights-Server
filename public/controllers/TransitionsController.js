App.controller('TransitionsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    $scope.setColorMode = function(mode) {
      $scope.defaultSettings.control = mode;
    };

    $scope.isColorModeSet = function(tabNum) {
      return $scope.defaultSettings.control === tabNum;
    };
    
    $scope.defaultSettings = {
      control: 'saturation', //hue, brightness, saturation, wheel
      theme: 'bootstrap',
      position: 'top right'
    };
    $scope.createdTransitions = [{
      colorSet: colorManager.getRandomColor(),
      speed: "2",
      refresh: "1000"
    }];

    $scope.addTransition = function (value) {
      $scope.createdTransitions.push({
        colorSet: colorManager.getRandomColor(),
        speed: "2",
        refresh: "1000"
      });
    }

    $scope.removeTransition = function () {
      $scope.createdTransitions.pop();
    }

    $scope.testTransition = function () {
      //TODO
      //add error when value length is 0 or 1

      console.log($scope.createdTransitions);
      socket.emit('test-transition', $scope.getTransitionModel());
    }

    //TODO implement save transition
    $scope.saveTransition = function () {
      //TODO
      //add error when value length is 0 or 1

      //console.log($scope.createdTransitions);
      //socket.emit('test-transition', $scope.getTransitionModel());
    }

    $scope.getTransitionModel = function() {
      var result = [];

      $scope.createdTransitions.forEach(function(element) {
        result.push({
          colorSet: colorManager.hexToRgb(element.colorSet),
          speed: element.speed,
          refresh: element.refresh
        });
      }, this);
      
      return result;
    }

    // $scope.$watch('color.colorSet', function() {
    //     socket.emit('change-color', colorManager.hexToRgb($scope.color.colorSet));
    // });
  }]);