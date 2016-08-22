(function(){
  'use strict';
  
  angular
    .module('d3CloudNgDemo', [
      'ui.router',
      'ui.bootstrap',
      'd3.cloud',
      'hljs',
      'd3CloudNgDemo.Tpls'
    ])
    
    .config([
      '$locationProvider',
      '$urlRouterProvider',
      '$stateProvider',
      App
    ]);

  function App($locationProvider, $urlRouterProvider, $stateProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'd3CloudNgDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/home.html',
        resolve: {
        }
      })
      .state('quickstart', {
        url: '/quickstart',
        controller: 'd3CloudNgDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/quickstart.html',
        resolve: {
        }
      })
      .state('api', {
        url: '/api',
        controller: 'd3CloudNgDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/api/index.html',
        resolve: {
        }
      })
    ;
      
  }
})();
