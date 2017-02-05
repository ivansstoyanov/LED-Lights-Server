App = angular.module('MyApp', ['ngRoute', 'minicolors']);

App.config(function (minicolorsProvider) {
    angular.extend(minicolorsProvider.defaults, {
        control: 'hue',
        position: 'bottom left',
        theme: 'bootstrap'
    });
});
