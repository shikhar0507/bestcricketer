var app = angular.module('app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url:'/home',
            templateUrl : 'views/hom.html',
            controller:'home',
            controllerAs:'main'
        })

        .state('n',{
            url:'/n',
            templateUrl: '/views/n.html',
            controller:'n'
        })
});