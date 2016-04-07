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
      .get('data/WordCloud-facet.json')
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
