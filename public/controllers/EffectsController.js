App.controller('EffectsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    $scope.tab = 'saved';
    $scope.setTab = function(tab) {
      $scope.tab = tab;
    };

    $scope.isTabSet = function(tabName) {
      return $scope.tab === tabName;
    };

    $scope.savedEffects = [{name: 'asd', data: { colorSet: 'asd' }}, {name: 'asd 1', data: { colorSet: 'asd1' }}];
    $scope.savedTransitions = [{name: 'trans1', data: { colorSet: 'asd' }}, {name: 'trans2', data: { colorSet: 'asd' }}];
    $scope.builderTransitions = [];

    socket.on('refresh-transitions', function(data) {
      $scope.savedTransitions = data;
    });

    socket.on('refresh-effects', function(data) {
      $scope.savedEffects = data;
    });

    io.emit('refresh-transitions', true);
    io.emit('refresh-effects', true);

    $scope.addTransitionTemplate = function () {
        $scope.builderTransitions.push({
            selectedTransition: $scope.savedTransitions[0].name,
            count: '20'
        });
    }

    $scope.removeTransitionTemplate = function () {
        $scope.builderTransitions.pop();
    }

    $scope.testEffect = function () {
        //same as start?
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
        
        socket.emit('save-effect', $scope.getEffectModel());
      }
    }

    socket.on('save-effect-done', function(data) {
      if (data == 'done') {
        $scope.effectName = '';
        $scope.effectNameShow = true;
       
        io.emit('refresh-effects', true);
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

    $scope.startEffect = function () {
        //same as test?
    }
}]);