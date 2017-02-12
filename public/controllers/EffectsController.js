App.controller('EffectsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    $scope.tab = 'transitions';
    $scope.setTab = function(tab) {
      $scope.tab = tab;
    };

    $scope.isTabSet = function(tabName) {
      return $scope.tab === tabName;
    };

    $scope.savedEffects = [];
    $scope.savedTransitions = [];
    $scope.builderTransitions = [];

    socket.on('refresh-transitions', function(data) {
      $scope.savedTransitions = data;
    });

    socket.on('refresh-effects', function(data) {
      $scope.savedEffects = data;
    });

    socket.emit('refresh-transitions', true);
    socket.emit('refresh-effects', true);

    $scope.addTransitionTemplate = function () {
        $scope.builderTransitions.push({
            selectedTransition: $scope.savedTransitions[0].name,
            count: '20'
        });
    }

    $scope.removeTransitionTemplate = function () {
        $scope.builderTransitions.pop();
    }

    $scope.effectName = '';
    $scope.effectNameShow = false;
    $scope.effectMessage = '';
    $scope.saveEffect = function () {
      if (!$scope.effectName) {
        $scope.effectNameShow = true;
        $scope.setMessage('set name');

      } else if ($scope.getEffectModel().length < 2) {
        $scope.setMessage('set more than two effects');

      } else {
        var result = {
          name: $scope.effectName,
          data: $scope.getEffectModel()
        };
        
        socket.emit('save-effect', result);
      }
    }

    socket.on('save-effect-done', function(data) {
      if (data == 'done') {
        $scope.effectName = '';
        $scope.effectNameShow = false;
       
        socket.emit('refresh-effects', true);
      }

      $scope.setMessage(data);
    });

    $scope.setMessage = function (data) {
      $scope.effectMessage = data;

      setTimeout(function() { 
        $scope.effectMessage = '';
        $scope.$apply();
      }, 5000);
    }

    $scope.getEffectModel = function () {
      var result = [];

      $scope.builderTransitions.forEach(function(element) {
        result.push({
          name: element.selectedTransition,
          refresh: element.count
        });
      }, this);
      
      return result;
    }

    $scope.editEffect = function () {
        //first make the routing
        //edit
    }

    $scope.testEffect = function () {
        socket.emit('test-effect', {
          name: 'test',
          data: $scope.getEffectModel()
        });
    }

    $scope.startEffect = function (selectedEffect) {
        socket.emit('start-effect', selectedEffect.name);
    }

    $scope.startTransition = function (selectedTransition) {
        socket.emit('start-transition', selectedTransition.name);
    }

    $scope.editTransition = function () {
        //same as test?
    }
}]);