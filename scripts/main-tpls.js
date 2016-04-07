(function(module) {
try {
  module = angular.module('d3CloudNgDemo.Tpls');
} catch (e) {
  module = angular.module('d3CloudNgDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/home.html',
    '<h1 class="page-header" itemprop="name">D3 Cloud for Angular</h1><div class="home row"><h4>Key features</h4><ul><li>Use D3 Cloud within Angular context</li><li>Show any word-score combinations easily</li><li>Tweak font, padding, scale and slope with simple config</li><li>Custom rotation per word</li></ul><h4>Example</h4><div class="row"><div class="col-md-10 col-md-offset-1"><d3-cloud words="ctrl.words" padding="0" rotate="ctrl.noRotate(word)"></d3-cloud></div></div><div style="display:none">{{ctrl.words}}</div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('d3CloudNgDemo.Tpls');
} catch (e) {
  module = angular.module('d3CloudNgDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quickstart.html',
    '<h1 class="page-header">Quickstart</h1><div class="row"><div class="col-md-12"><p>To start using D3 Cloud for Angular, follow these simple steps to get started.</p><ol class="steps"><li><p>Download <a href="https://raw.github.com/grtjn/d3-cloud-ng/master/dist/d3-cloud-ng.js">d3-cloud-ng.js</a> (<a href="https://raw.github.com/grtjn/d3-cloud-ng/master/dist/d3-cloud-ng.min.js">minified version</a>) and put it with your other scripts. Alternatively, you can use Bower to install it automatically:</p><div hljs="" no-escape="" language="bash">bower install [--save] d3-cloud-ng</div><p>Or if you prefer bleeding edge:</p><div hljs="" no-escape="" language="bash">bower install [--save] git@github.com:grtjn/d3-cloud-ng.git</div><p>If not using Bower, you\'ll also need to fetch <a href="https://github.com/jasondavies/d3-cloud/blob/master/build/d3.layout.cloud.js" rel="external">d3.layout.cloud.js</a> yourself.</p></li><li><p>Load ui-utils.js, ui-map.js, and d3-cloud-ng.js into your HTML page (typically in the end of the <em>BODY</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;script src=\'/bower_components/d3-cloud/build/d3.layout.cloud.js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/d3-cloud-ng/dist/d3-cloud-ng[.min].js\'>&lt;/script></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p></li><li><p>Load d3-cloud-ng.css into your HTML page (typically in the end of the <em>HEAD</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;link rel="stylesheet" href="/bower_components/d3-cloud-ng/dist/d3-cloud-ng[.min].css"></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p></li><li><p>Make your application module depend on the <code>d3-cloud-ng</code> module:</p><div hljs="" no-escape="" language="js">angular.module(\'myApplicationModule\', [\'d3.cloud\']);</div></li><li><p>Expose objects and call-back functions in your Angular controller:</p><pre hljs="" no-escape="" language="js">\n' +
    'SearchCtrl.$inject = [\'$scope\', \'$location\', \'userService\', \'MLSearchFactory\'];\n' +
    '\n' +
    '// inherit from MLSearchController\n' +
    'var superCtrl = MLSearchController.prototype;\n' +
    'SearchCtrl.prototype = Object.create(superCtrl);\n' +
    '\n' +
    'function SearchCtrl($scope, $location, userService, searchFactory) {\n' +
    '  var ctrl = this;\n' +
    '  var mlSearch = searchFactory.newContext();\n' +
    '\n' +
    '  superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);\n' +
    '\n' +
    '  ctrl.init();\n' +
    '\n' +
    '  // override the updateSearchResults function from superCtrl to append a call to updateCloud..\n' +
    '  ctrl.updateSearchResults = function updateSearchResults(data) {\n' +
    '    superCtrl.updateSearchResults.apply(ctrl, arguments);\n' +
    '    ctrl.updateCloud(data);\n' +
    '    return ctrl;\n' +
    '  };\n' +
    '\n' +
    '  ctrl.words = [];\n' +
    '\n' +
    '  ctrl.updateCloud = function(data) {\n' +
    '    if (data && data.facets && data.facets.TagCloud) {\n' +
    '      ctrl.words = [];\n' +
    '      var activeFacets = [];\n' +
    '\n' +
    '      // find all selected facet values..\n' +
    '      angular.forEach(mlSearch.getActiveFacets(), function(facet, key) {\n' +
    '        angular.forEach(facet.values, function(value, index) {\n' +
    '          activeFacets.push((value.value+\'\').toLowerCase());\n' +
    '        });\n' +
    '      });\n' +
    '\n' +
    '      angular.forEach(data.facets.TagCloud.facetValues, function(value, index) {\n' +
    '        var q = (ctrl.qtext || \'\').toLowerCase();\n' +
    '        var val = value.name.toLowerCase();\n' +
    '\n' +
    '        // suppress search terms, and selected facet values from the D3 cloud..\n' +
    '        if (q.indexOf(val) < 0 && activeFacets.indexOf(val) < 0) {\n' +
    '          ctrl.words.push({name: value.name, score: value.count});\n' +
    '        }\n' +
    '      });\n' +
    '    }\n' +
    '  };\n' +
    '\n' +
    '  ctrl.noRotate = function(word) {\n' +
    '    return 0;\n' +
    '  };\n' +
    '\n' +
    '}\n' +
    '</pre></li><li><p>Add a <code>&lt;d3-cloud&gt;</code> element in your template like so:</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;d3-cloud words="ctrl.words" padding="0" rotate="ctrl.noRotate(word)">&lt;/d3-cloud></pre></li></ol></div></div>');
}]);
})();
