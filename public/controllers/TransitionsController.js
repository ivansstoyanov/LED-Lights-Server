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
      if ($scope.getTransitionModel().length < 2) {
        $scope.setMessage('set more than two colors');
      }
      
      socket.emit('test-transition', $scope.getTransitionModel());
    }

    $scope.transitionName = '';
    $scope.transitionNameShow = false;
    $scope.transitionMessage = '';
    $scope.saveTransition = function () {
      if (!$scope.transitionName) {
        $scope.transitionNameShow = true;
        $scope.setMessage('set name');

      } else if ($scope.getTransitionModel().length < 2) {
        $scope.setMessage('set more than two colors');

      } else {
        var result = {
          name: $scope.transitionName,
          data: $scope.getTransitionModel()
        };

        socket.emit('save-transition', result);
      }
    }

    socket.on('save-transition-done', function(data) {
      if (data == 'done') {
        $scope.transitionName = '';
        $scope.transitionNameShow = false;
        
        socket.emit('refresh-transitions', true);
      }

      $scope.setMessage(data);
    });

    $scope.setMessage = function (data) {
      $scope.transitionMessage = data;

      setTimeout(function() { 
        $scope.transitionMessage = '';
        $scope.$apply();
      }, 3000);
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
  }]);