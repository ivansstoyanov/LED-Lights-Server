App.controller('TransitionsController', ['$scope', 'socket', 'ColorManager', function($scope, socket, colorManager) {

    // $scope.setColorMode = function(mode) {
    //   $scope.customSettings.control = mode;
    // };

    // $scope.isColorModeSet = function(tabNum) {
    //   return $scope.customSettings.control === tabNum;
    // };


    // $scope.customSettings = {
    //   control: 'hue', //hue, brightness, saturation, wheel
    //   theme: 'bootstrap',
    //   position: 'bottom left', // first top/bottom then left/right
    //   inline: true,
    //   //opacity: true,
    //   //letterCase: 'uppercase' //lowercase
    // };

    // $scope.$watch('color.colorSet', function() {
    //     socket.emit('change-color', colorManager.hexToRgb($scope.color.colorSet));
    // });

    // $scope.color = {
    //   colorSet: '#266ad1',
    // };
  }]);