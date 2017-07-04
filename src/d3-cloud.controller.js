(function() {

  'use strict';

  angular.module('d3.cloud')
    .controller('d3CloudController', d3CloudController);

  d3CloudController.$inject = ['$scope'];

  function d3CloudController($scope) {
    $scope.$watch('words', function (newValue, oldValue) {
      angular.element(document).ready(function () {
        var i = [];
        var items = [];
        var updateflag = 0;

        if (newValue) {
          items = $scope.filterFunction($scope.words);
          if ($scope.cloud) {
            if (oldValue) {
              if (oldValue.length !== newValue.length) {
                updateflag = 1;
              } else if (items.length > 0) {
                updateflag = 1;
              } else {
                for (i = 0; i < newValue.length; i++) {
                  if (!updateflag & newValue[i].name !== oldValue[i].name & newValue[i].score !== oldValue[i].score) {
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
            $scope.createCloud(items);
          }
        } else if ($scope.cloud) {
          // flush existing words
          $scope.updateCloud([]);
        }
      });
    }, true);
  }
})();
