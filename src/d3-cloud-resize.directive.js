/**
 * @ngdoc directive
 * @memberOf 'd3.cloud'
 * @name d3-cloud-resize
 * @description
 *   Angular directive which broadcast window resize to the d3-cloud directive.
 *
 *
 * @example
 *   <body d3-cloud-resize>
 *   </body>
 */

(function () {

  'use strict';

  angular.module('d3.cloud')
    .directive('d3CloudResize', ['$window', d3CloudResizeDirective]);

  d3CloudResizeDirective.$inject = [];

  function d3CloudResizeDirective($window) {
    return {
      link: function ($scope) {
        angular.element($window).bind('resize', function() {
          $scope.$broadcast('d3-cloud:window-resized');
        });
      }
    };
  }

}());
