(function () {
  'use strict';

  angular.module('d3.cloud', [
    'd3.cloud.tpls'
  ]);
}());

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

/**
 * @ngdoc directive
 * @memberOf 'd3.cloud'
 * @name d3-cloud
 * @description
 *   Angular directive wrapping the d3-cloud library.
 *
 * @attr {Object}    events       Optional. An object with a property for each event callback function to be supported. Default: {}.
 * @attr {Function}  filter       Optional. A function that filters words. Invoked for each word, should return true to retain the word, false to skip. Defaults to comparing against ignoreList for legacy purposes.
 * @attr {String}    font         Optional. The name of the font to use. Default: Impact.
 * @attr {Array}     ignoreList   Deprecated. Optional. An array of word names to ignore. Default: [].
 * @attr {Integer}   padding      Optional. The padding to apply between words. Default: 5.
 * @attr {Function}  rotate       Optional. A function reference that calculates rotation per word. Takes word object, and index in 'words' array. Default: alternating 45 degree left/right.
 * @attr {Integer}   slope-base   Optional. The minimum size for words. Default: 2.
 * @attr {Integer}   slope-factor Optional. The scale factor applied to scores. Default: 30.
 * @attr {Array}     words        A binding to an array of objects with name, score and optional color properties.
 *
 * @example
 *   <d3-cloud events="ctrl.wordEvents" font="Impact" filter="ctrl.filter" padding="5"
 *     rotate="ctrl.rotateWord" slope-base="2" slope-factor="30" words="ctrl.words">
 *   </d3-cloud>
 */

/* global d3 */
(function () {

  'use strict';

  angular.module('d3.cloud')
    .directive('d3Cloud', d3CloudDirective);

  d3CloudDirective.$inject = ['$log', '$window'];

  function d3CloudDirective($log, $window) {
    return {
      restrict: 'E',
      replace: 'true',
      scope: {
        events: '=?',
        font: '@',
        ignoreList: '=?',
        filter: '&?',
        padding: '@',
        rotate: '&?',
        slopeBase: '@',
        slopeFactor: '@',
        words: '='
      },
      templateUrl: function () {
        return '/d3-cloud-ng/d3-cloud.html';
      },
      controller: 'd3CloudController',
      controllerAs: 'ctrl',
      link: function ($scope, $element, $attrs) {
        // init scope vars
        $scope.events = $scope.events || {};
        $scope.font = $scope.font || 'Impact';
        $scope.ignoreList = $scope.ignoreList || [];
        if ($scope.ignoreList.length > 0) {
          $log.warn('You are using deprecated ignoreList. Please use custom filter function instead.');
        }
        $scope.filter = $scope.filter || function (word) {
            return $scope.ignoreList.indexOf(word.word.name) === -1;
          };
        $scope.filteredWords = [];

        // helper vars
        var padding = $attrs.padding ? Number($scope.padding) : 5;
        var rotate = $scope.rotate && function (d, i) {
            return $scope.rotate({word: $scope.filteredWords[i]});
          } || function () {
            return ~~(Math.random() * 2) * 90 - 45;
          };
        var slopeBase = $attrs.slopeBase ? Number($scope.slopeBase) : 2;
        var slopeFactor = $attrs.slopeFactor ? Number($scope.slopeFactor) : 30;

        // callback for updating cloud on change or resize events
        $scope.updateCloud = function (words) {
          var cloudHeight = $element[0].clientHeight + 0;
          var cloudWidth = $element[0].clientWidth + 0;
          var minScore = 0;
          var maxScore = 1;
          var slope = 1;

          words.map(function (d) {
            if (minScore > d.score) {
              minScore = d.score;
            }
            if (maxScore < d.score) {
              maxScore = d.score;
            }
          });

          if (maxScore !== minScore) {
            slope = slopeFactor / (maxScore - minScore);
          }

          $scope.cloud = d3.layout.cloud().size([cloudWidth, cloudHeight]);
          $scope.cloud
            .words(words.map(function (d) {
              var result = {
                text: d.name,
                size: d.score * slope + slopeBase
              };
              if (d.color) {
                result.color = d.color;
              }
              return result;
            }))
            .padding(padding)
            .rotate(rotate)
            .font($scope.font)
            .fontSize(function (d) {
              return d.size;
            })
            .on('end', update)
            .start();
        };

        // create initial cloud when directive is initialized
        if (!$scope.cloud && $scope.filteredWords && $scope.filteredWords.length) {
          $scope.updateCloud($scope.filteredWords);
        }

        // start watching window resize event
        var windowResized = function() {
          $scope.updateCloud($scope.filteredWords);
        };
        angular.element($window).on('resize', windowResized);
        $scope.$on('$destroy', function () {
          angular.element($window).off('scroll', windowResized);
        });

        // actual (re)painting with D3
        function update(items) {
          var size = $scope.cloud.size();
          var fill = (d3.schemeCategory20 ? d3.schemeCategory20 : d3.scale.category20());

          // grab or create svg element
          var svg = d3.select($element[0]).select('svg');
          if (svg.empty()) {
            svg = d3.select($element[0]).append('svg');
          }
          svg
            .attr('width', size[0])
            .attr('height', size[1]);

          // grab or create g element
          var g = svg.selectAll('g');
          if (g.empty()) {
            g = svg.append('g');
          }

          // apply transform to match the size of container
          var words = g
            .attr('transform', 'translate(' + size[0] / 2 + ',' + size[1] / 2 + ')')
            .selectAll('text')
            .data(items);

          // append new text elements
          words.enter().append('text');

          // update all words in the word cloud (when you append
          // nodes from the 'enter' selection, d3 will add the new
          // nodes to the 'update' selection, thus all of them will
          // be updated here.
          words
            .style('font-size', function (d) {
              return d.size + 'px';
            })
            .style('font-family', $scope.font)
            .style('fill', function (d, i) {
              if (items[i].color) {
                return items[i].color;
              }
              return fill(i);
            })
            .attr('text-anchor', 'middle')
            .attr('transform', function (d) {
              return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
            })
            .on($scope.events)
            .text(function (d) {
              return d.text;
            });
          words.exit().remove(); // new line to remove all unused words
        }

      }
    };
  }

}());

(function(module) {
try {
  module = angular.module('d3.cloud.tpls');
} catch (e) {
  module = angular.module('d3.cloud.tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/d3-cloud-ng/d3-cloud.html',
    '<div class="d3-cloud">\n' +
    '  <div class="cloud"> \n' +
    '\n' +
    '  <div ng-if="filteredWords.length === 0">\n' +
    '    No results to display.\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();
