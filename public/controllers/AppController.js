App.controller('AppController', ['$scope', function($scope) {

    $scope.tab = 2;
    
    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };

}]);