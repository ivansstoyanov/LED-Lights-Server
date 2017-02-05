App.directive('colorSelect', function() {
  return {
    templateUrl: 'public/directives/colorSelectView.html',
    scope: {
        colorSet: '=',
        defaultSettings: '='
    },
  };
});
