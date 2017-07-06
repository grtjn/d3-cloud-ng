(function () {

  'use strict';

  angular.module('d3.cloud')
    .controller('d3CloudController', d3CloudController);

  d3CloudController.$inject = ['$scope'];

  function d3CloudController($scope) {
    $scope.$watch('words', function (newValue, oldValue) {
      var i = [];
      var items = [];
      var updateflag = 0;

      if (newValue) {
        for (var i = 0; i < newValue.length; i++) {
          if ($scope.filter(newValue[i])) {
            items.push(newValue[i]);
          }
        }
        if ($scope.cloud) {
          if (oldValue) {
            if (oldValue.length !== items.length) {
              updateflag = 1;
            } else {
              for (i = 0; i < items.length; i++) {
                if (!updateflag & items[i].name !== oldValue[i].name & items[i].score !== oldValue[i].score) {
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
    }, true);
  }
})();
