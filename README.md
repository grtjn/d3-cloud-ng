# d3-cloud-ng
Angular directive wrapping the d3-cloud library.

## Usage

Assuming a project generated with `slush-marklogic-node`, or some other project running on `ml-search-ng`, add something like the following to your `search.controller.js`:

    // override the updateSearchResults function from superCtrl to append a call to updateCloud..
    ctrl.updateSearchResults = function updateSearchResults(data) {
      superCtrl.updateSearchResults.apply(ctrl, arguments);
      ctrl.updateCloud(data);
      return ctrl;
    };
    
    ctrl.words = [];
    
    ctrl.updateCloud = function(data) {
      if (data && data.facets && data.facets.TagCloud) {
        ctrl.words = [];
        var activeFacets = [];
        
        // find all selected facet values..
        angular.forEach(mlSearch.getActiveFacets(), function(facet, key) {
          angular.forEach(facet.values, function(value, index) {
            activeFacets.push((value.value+'').toLowerCase());
          });
        });
        
        angular.forEach(data.facets.TagCloud.facetValues, function(value, index) {
          var q = (ctrl.qtext || '').toLowerCase();
          var val = value.name.toLowerCase();
          
          // suppress search terms, and selected facet values from the D3 cloud..
          if (q.indexOf(val) < 0 && activeFacets.indexOf(val) < 0) {
            ctrl.words.push({name: value.name, score: value.count});
          }
        });
      }
    };
    
    ctrl.noRotate = function(word) {
      return 0;
    };

The above also assumes you have defined a search range constraint called `TagCloud` with the `facet=true` option. But you can also just feed the `<d3-cloud>` directive with an array of `{name:.., score:..}` objects.

Add for instance the following to your `search.html`:

    <d3-cloud words="ctrl.words" padding="0" rotate="ctrl.noRotate(word)"></d3-cloud>

And to finish off, enable the d3.cloud module, by adding it as dependency to your app, or the module in which you want to use it.
