App.directive('repeatTransition', function() {
  return {
    templateUrl: 'public/directives/repeatTransitionView.html',
    scope: {
        transitionsList: '=',
        selectedTransition: '=',
        count: '='
    }
  };
});