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
        selectedEffect: 'randomEffect',
        count: '20'
    }];

    $scope.addTransitionTemplate = function () {
        debugger;
        $scope.builderTransitions.push({
            //effectsList: $scope.savedTransitions,
            selectedEffect: 'randomEffect',
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

    $scope.saveEffect = function () {
        //save
    }

    $scope.editEffect = function () {
        //edit
    }

}]);