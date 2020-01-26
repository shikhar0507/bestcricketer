var app = angular.module('app',['ui.router','nvd3']);

app.config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url:'/home',
            templateUrl : 'views/main.html',
            controller:'home',
            controllerAs:'main'
        })

        
    });
    
   