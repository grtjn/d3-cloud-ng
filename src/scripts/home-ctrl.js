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

    ctrl.noRotate = function(word) {
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

    ctrl.cloudEvents = {
      'dblclick': function(tag) {
        // stop propagation
        d3.event.stopPropagation();
        
        // undo default behavior of browsers to select at dblclick
        var body = document.getElementsByTagName('body')[0];
        window.getSelection().collapse(body,0);
        
        // custom behavior
        window.alert('Clicked ' + tag.text);
      }
    };

  }

}());
