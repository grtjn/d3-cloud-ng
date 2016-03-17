(function() {

  'use strict';

  angular.module('d3.cloud')
    .controller('d3CloudController', d3CloudController);

  d3CloudController.$inject = ['$scope'];

  function d3CloudController($scope) {
    $scope.$watch('words', function(newValue, oldValue) {
      var i = [];
      var items = [];
      var ignoreList = '';//licenses,***********,HTTP,http,License,Technologies,NFS,Creative,Commons,by,be,under,30,from,about,on, *,to,s,i,please,it,a,for,this,in,the,and,is,of,an,with,u,us,that,been,An,*,A,in,at,is,has,been';
      var ignore = ignoreList.split(',');
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
            //if (newValue[i].score > 4 & newValue[i].score < 28) {
            items.push(newValue[i]);
            //}
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
