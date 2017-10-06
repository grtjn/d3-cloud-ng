(function () {

  'use strict';

  angular.module('d3.cloud')
    .controller('d3CloudController', d3CloudController);

  d3CloudController.$inject = ['$scope'];

  function d3CloudController($scope) {
    $scope.$watch('words', function (newValue, oldValue) {
      var items = null;
      var updateflag = 0;

      if (newValue) {
        items = filterWords(newValue);
        $scope.filteredWords = items;

        if ($scope.cloud) {
          if (oldValue) {
            if (oldValue.length !== items.length) {
              updateflag = 1;
            } else {
              for (var i = 0; i < items.length; i++) {
                if (!updateflag && (items[i].name !== oldValue[i].name) && (items[i].score !== oldValue[i].score)) {
                  updateflag = 1;
                }
              }
            }
          } else {
            updateflag = 1;
          }

          if (updateflag) {
            // only update if changed
            $scope.updateCloud(items);
          }
        } else {
          // create from scratch
          $scope.updateCloud(items);
        }
      } else if ($scope.cloud) {
        // flush existing words
        items = [];
        $scope.updateCloud(items);
        $scope.filteredWords = items;
      }

    }, true);

    function filterWords(items) {
      var result = [];
      for (var i = 0; i < items.length; i++) {
        if ($scope.filter({ word: items[i] })) {
          result.push(items[i]);
        }
      }
      return result;
    }
  }
})();
