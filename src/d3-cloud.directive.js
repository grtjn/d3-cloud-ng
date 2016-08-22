 /**
  * @ngdoc directive
  * @memberOf 'd3.cloud'
  * @name d3-cloud
  * @description
  *   Angular directive wrapping the d3-cloud library.
  *
  * @attr {Object}    events        Optional. An object with a property for each event callback function to be supported. Default: {}.
  * @attr {String}    font          Optional. The name of the font to use. Default: Impact.
  * @attr {Array}     ignoreList    Optional. An array of word names to ignore. Default: [].
  * @attr {Integer}   padding       Optional. The padding to apply between words. Default: 5.
  * @attr {Function}  rotate        Optional. A function reference that calculates rotation per word. Takes word object, and index in 'words' array. Default: alternating 45 degree left/right.
  * @attr {Integer}   slope-base    Optional. The minimum size for words. Default: 2.
  * @attr {Integer}   slope-factor  Optional. The scale factor applied to scores. Default: 30.
  * @attr {Array}     words         A binding to an array of objects with name and score properties.
  *
  * @example
  *   <d3-cloud events="ctrl.wordEvents" font="Impact" ignoreList="ctrl.ignoreWords" padding="5"
  *     rotate="ctrl.rotateWord" slope-base="2" slope-factor="30" words="ctrl.words">
  *   </d3-cloud>
  */

/* global d3 */
(function() {

  'use strict';

  angular.module('d3.cloud')
    .directive('d3Cloud', d3CloudDirective);

  d3CloudDirective.$inject = [];

  function d3CloudDirective() {
    return {
      restrict: 'E',
      replace: 'true',
      scope: {
        events: '=?',
        font: '@',
        ignoreList: '=?',
        padding: '@',
        rotate: '&?',
        slopeBase: '@',
        slopeFactor: '@',
        words: '='
      },
      templateUrl: function() { return '/d3-cloud-ng/d3-cloud.html'; },
      controller: 'd3CloudController',
      controllerAs: 'ctrl',
      link: function($scope, $element, $attrs) {
        $scope.events = $scope.events || {};
        $scope.font = $scope.font || 'Impact';
        $scope.ignoreList = $scope.ignoreList || [];

        var padding = $attrs.padding ? Number($scope.padding) : 5;
        var rotate = $scope.rotate && function(d, i) {
          return $scope.rotate({word: $scope.words[i] });
        } || function() {
          return ~~(Math.random() * 2) * 90 - 45;
        };
        var slopeBase = $attrs.slopeBase ? Number($scope.slopeBase) : 2;
        var slopeFactor = $attrs.slopeFactor ? Number($scope.slopeFactor) : 30;

        $scope.createCloud = function(words) {
          var cloudWidth = $element[0].clientWidth + 0;
          var cloudHeight = $element[0].clientWidth + 0;

          var minScore = 0;
          var maxScore = 1;
          var slope = 1;

          words.map(function(d) {
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
            .words(words.map(function(d) {
              return {
                text: d.name,
                size: d.score * slope + slopeBase
              };
            }))
            .padding(padding)
            .rotate(rotate)
            .font($scope.font)
            .fontSize(function(d) {
              return d.size;
            })
            .on('end', draw)
            .start();
        };

        $scope.updateCloud = function(words) {
          var cloudWidth = $element[0].clientWidth + 0;
          var cloudHeight = $element[0].clientWidth + 0;

          var minScore = 0;
          var maxScore = 1;
          var slope = 1;

          words.map(function(d) {
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
            .words(words.map(function(d) {
              return {
                text: d.name,
                size: d.score * slope + slopeBase
              };
            }))
            .padding(padding)
            .rotate(rotate)
            .font($scope.font)
            .fontSize(function(d) {
              return d.size;
            })
            .on('end', update)
            .start();
        };

        if (!$scope.cloud && $scope.words && $scope.words.length) {
          $scope.createCloud($scope.words);
        }

        function update(data) {
          var size = $scope.cloud.size();
          var fill = (d3.schemeCategory20 ? d3.schemeCategory20 : d3.scale.category20());
          var words = d3.select($element[0]).select('svg')
            .selectAll('g')
            .attr('transform', 'translate('+size[0]/2+','+size[1]/2+')')
            .selectAll('text')
            .data(data);

          // append new text elements
          words.enter().append('text');

          // update all words in the word cloud (when you append
          // nodes from the 'enter' selection, d3 will add the new
          // nodes to the 'update' selection, thus all of them will
          // be updated here.
          words.style('font-size', function(d) {
              return d.size + 'px';
            })
            .style('font-family', $scope.font)
            .style('fill', function(d, i) {
              return fill(i);
            })
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
            })
            .on($scope.events)
            .text(function(d) {
              return d.text;
            });
          words.exit().remove(); // new line to remove all unused words
        }

        function draw(words) {
          var size = $scope.cloud.size();
          var fill = (d3.schemeCategory20 ? d3.schemeCategory20 : d3.scale.category20());
          d3.select($element[0]).append('svg')
            .attr('width', size[0])
            .attr('height', size[1])
            .append('g')
            .attr('transform', 'translate('+size[0]/2+','+size[1]/2+')')
            .selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', function(d) {
              return d.size + 'px';
            })
            .style('font-family', $scope.font)
            .style('fill', function(d, i) {
              return fill(i);
            })
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
            })
            .on($scope.events)
            .text(function(d) {
              return d.text;
            });
        }
      }
    };
  }

}());
