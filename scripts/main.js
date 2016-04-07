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
    ;
      
  }
})();

(function () {
  'use strict';

  angular.module('d3CloudNgDemo')

    .controller('d3CloudNgDemo.HomeCtrl', [
      '$scope',
      '$http',
      '$location',
      '$window',
      HomeCtrl
    ]);

  function HomeCtrl($scope, $http, $location, $window) {
    var ctrl = this;
    $scope.ctrl = ctrl;

    ctrl.words = [];

    ctrl.noRotate = function() {
      return 0;
    };

    $http
      .get('data/WordCloud-facets.json')
      .success(function(response) {
        ctrl.updateCloud(response);
      });

    ctrl.updateCloud = function(data) {
      if (data && data.facets && data.facets.WordCloud) {
        ctrl.words = [];

        angular.forEach(data.facets.WordCloud.facetValues, function(value, index) {
          ctrl.words.push({name: value.name, score: value.count});
        });
      }
    };

  }

}());
