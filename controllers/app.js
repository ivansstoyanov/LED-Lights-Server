var app = angular.module('myApp', []);

app.controller('homeController', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});