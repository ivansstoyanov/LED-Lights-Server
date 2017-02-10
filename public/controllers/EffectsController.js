App.controller('EffectsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    $scope.tab = 'saved';
    $scope.setTab = function(tab) {
      $scope.tab = tab;
    };

    $scope.isTabSet = function(tabName) {
      return $scope.tab === tabName;
    };

    $scope.savedTransitions = ['saved1', 'saved2'];
    $scope.builderTransitions = [{
        //effectsList: $scope.savedTransitions,
        selectedEffect: $scope.savedTransitions[0],
        count: '20'
    }];

    $scope.addTransitionTemplate = function () {
        debugger;
        $scope.builderTransitions.push({
            //effectsList: $scope.savedTransitions,
            selectedEffect: $scope.savedTransitions[0],
            count: '20'
        });
    }

    $scope.removeTransitionTemplate = function () {
        $scope.builderTransitions.pop();
    }

    $scope.testEffect = function () {
        //same as start?
    }

    $scope.startEffect = function () {
        //same as test?
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
        $scope.effectNameShow = true;

        socket.emit('save-effect', $scope.getEffectModel());
      }
    }

    socket.on('save-effect-done', function(data) {
      if (data == 'done') {
        $scope.effectName = '';
        $scope.effectNameShow = true;
       
        //refresh saved data : )
        //io.emit('change-pin-settings', pinSettings);
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

    $scope.editEffect = function () {
        //first make the routing
        //edit
    }

}]);