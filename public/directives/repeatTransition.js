App.directive('repeatTransition', ['ColorManager', function(colorManager) {
  return {
    templateUrl: 'public/directives/repeatTransitionView.html',
    scope: {
        repeatValue: '=',
        colorSet: '=',
        repeatWidth: '=',
        count: '='
    },
    link: function (scope, element, attrs) {
      scope.invert = '#' + colorManager.invertHex(scope.colorSet);
    }
  };
}]);