App.directive('repeatTransition', function() {
  return {
    templateUrl: 'public/directives/repeatTransitionView.html',
    scope: {
        effectsList: '=',
        selectedEffect: '=',
        count: '='
    }
  };
});