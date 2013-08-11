/* 
 * angular-disqus 0.0.1
 * http://github.com/kirstein/angular-disqus
 * 
 * Licensed under the MIT license
 */
(function (angular) {
  "use strict";

  var disqusModule = angular.module('ngDisqus', []);

  disqusModule.service('$disqus', [ '$location', '$window', function($location, $window) {

    /**
     * Adds disqus script tag to header.
     * Initializes default values for url and disqus thread id.
     *
     * @param {String} id disqus thread id
     */
    function buildCommit(id) {
      // Set the default values
      $window.disqus_identifier = id;
      $window.disqus_url        = $location.absUrl();

      var disqus = document.createElement('script');

      // Configure the script tag
      disqus.type  = 'text/javascript';
      disqus.async = true;
      disqus.src   = '//' + $window.disqus_shortname + '.disqus.com/embed.js';

      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(disqus);
    }

    /**
     * Trigger the reset comment call
     * @param  {String} id Thread id
     */
    function resetCommit(id) {
      $window.DISQUS.reset({
        reload: true,
        config : function() {
          this.page.identifier = id;
          this.page.url        = $location.absUrl();
        }
      });
    }

    /**
     * Resets the comment for thread.
     * If disqus was not defined then it will add disqus to script tags.
     * If disqus was initialized earlier then it will just use disqus api to reset it
     *
     * @param  {String} id required thread id
     */
    this.commit = function(id) {
      if (!angular.isDefined($window.disqus_shortname)) {
        throw new Error('No disqus shortname defined');
      } else if (!angular.isDefined(id)) {
        throw new Error('No disqus thread id defined');
      } else if (angular.isDefined($window.DISQUS)) {
        resetCommit(id);
      } else {
        buildCommit(id);
      }
    };

    /**
     * Setter and getter for the shortname property.
     *
     * @param  {[String]} name Setter or getter for shortname. If left undefined will return the value.
     * @return {String}      disqus shortname
     */
    this.shortname = function(name) {
      return $window.disqus_shortname = name || $window.disqus_shortname;
    };
  }]);

  disqusModule.directive('disqus', [ '$disqus', function($disqus) {

    return {
      restrict : 'EA',
      replace  : true,
      template : '<div id="disqus_thread"></div>',
      link: function link(scope, element, attr) {
        scope.$watch(attr.disqus, function(id) {
          if (angular.isDefined(id)) {
            $disqus.commit(id);
          }
        });
      }
    };
  }]);

})(angular);
