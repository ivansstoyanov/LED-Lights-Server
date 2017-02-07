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
      position: 'bottom left'
    };
    $scope.createdTransitions = [];
    $scope.repeatColors = [];
    $scope.repeatWidth = 380;

    $scope.addTransition = function (value, repeatValue) {
      var transition = {
        type: value
      };
      
      if (value == 'color') {
        transition.colorSet = colorManager.getRandomColor();
        transition.speed = "2";
        transition.refresh = "1000";
      } else if (value == 'repeat') {
        transition.repeatValue = repeatValue;
        transition.count = '10';

        if (repeatValue) {
          transition.colorSet = colorManager.getRandomColor();
          $scope.repeatColors.push(transition.colorSet);

          $scope.repeatWidth -= 50;
          transition.repeatWidth = $scope.repeatWidth + "px";
        } else {
          if ($scope.repeatColors.length == 0) return;

          transition.colorSet = $scope.repeatColors.pop();

          $scope.repeatWidth += 50;
          transition.repeatWidth = $scope.repeatWidth + "px";
        }
      }

      $scope.createdTransitions.push(transition);
    }

    $scope.removeTransition = function () {
      $scope.createdTransitions.pop();
    }

    $scope.testTransition = function () {
      console.log($scope.createdTransitions);
      socket.emit('test-transition', $scope.getTransitionModel());
    }

    $scope.getTransitionModel = function() {
      var result = [];

      result.push({
        colorSet: colorManager.hexToRgb($scope.defaultColor),
        refresh: '1000',
        speed: '2'
      });

      $scope.createdTransitions.forEach(function(element) {
        result.push({
          colorSet: colorManager.hexToRgb(element.colorSet),
          speed: element.speed,
          refresh: element.refresh
        });
      }, this);

      console.log(result);
      
      return result;
    }

    // $scope.$watch('color.colorSet', function() {
    //     socket.emit('change-color', colorManager.hexToRgb($scope.color.colorSet));
    // });

    // $scope.color = {
    //   colorSet: '#266ad1',
    // };
  }]);