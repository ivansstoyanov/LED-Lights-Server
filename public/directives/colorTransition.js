App.directive('colorTransition', function() {
  return {
    templateUrl: 'public/directives/colorTransitionView.html',
    scope: {
        colorSet: '=',
        defaultSettings: '=',
        speed: '=',
        refresh: '='
    },
  };
});