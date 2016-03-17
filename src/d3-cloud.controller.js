(function() {

  'use strict';

  angular.module('d3.cloud')
    .controller('d3CloudController', d3CloudController);

  d3CloudController.$inject = ['$scope'];

  function d3CloudController($scope) {
    $scope.$watch('words', function(newValue, oldValue) {
      var i = [];
      var items = [];
      var ignore = $scope.ignoreList;
      var updateflag = 0;

      if (newValue) {
        if (oldValue) {
          if (oldValue.length !== newValue.length) {
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

        for (i = 0; i < newValue.length; i++) {
          if (ignore.indexOf(newValue[i].name) < 1) {
            items.push(newValue[i]);
          }
        }
        if (updateflag) {
          if ($scope.cloud) {
            $scope.updateCloud(items);
          } else {
            $scope.createCloud(items);
          }
        }
      } else if ($scope.cloud) {
        $scope.updateCloud(items);
      }

    });
  }
})();
