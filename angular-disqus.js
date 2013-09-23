/* 
 * angular-disqus 1.0.1
 * http://github.com/kirstein/angular-disqus
 * 
 * Licensed under the MIT license
 */
(function (angular, window) {
  "use strict";

  var disqusModule = angular.module('ngDisqus', [ ]);

  /**
   * $disqus provider.
   */
  disqusModule.provider('$disqus', function() {

    var shortname;

    /**
     * @return {Element} dom element for script adding
     */
    function getScriptContainer() {
      return (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
    }

    /**
     * @return {String} disqus shortname
     */
    function getShortname() {
      return shortname || window.disqus_shortname;
    }

    /**
     * @param {String} shortname disqus shortname
     * @return {String} disqus embed src with embedded shortname
     */
    function getScriptSrc(shortname) {
      return '//' + shortname + '.disqus.com/embed.js';
    }

    /**
     * Builds the script tag
     * @param {String} shortname disqus shortname
     * @return {Element} script element
     */
    function buildScriptTag(shortname) {
      var script = document.createElement('script');

      // Configure the script tag
      script.type  = 'text/javascript';
      script.async = true;
      script.src   = getScriptSrc(shortname);

      return script;
    }

    /**
     * Searches the given element for defined script tag
     * if its already there then return true. Otherwise return false
     *
     * @param {Element} element element to search within
     * @param {String} shortname shortname to search
     * @return {Boolean} true if its there, false if its not
     */
    function hasScriptTagInPlace(container, shortname) {
      var scripts   = container.getElementsByTagName('script'),
          scriptSrc = getScriptSrc(shortname),
          script, i;

      for (i = 0; i < scripts.length; i += 1) {
        script = scripts[i];

        // Check if the name contains the given values
        // We need to check with indexOf because browsers replace // with their protocol
        if (~script.src.indexOf(scriptSrc)) {
          return true;
        }
      }

      return false;
    }

    /**
     * Writes disqus globals to window object.
     * Needed for the first load. Otherwise the disqus wouldn't know what thread comments to load.
     *
     * @param {String} id disqus identifier
     * @param {String} url disqus url
     * @param {String} shortname disqus shortname
     */
    function setGlobals(id, url, shortname) {
      window.disqus_identifier = id;
      window.disqus_url        = url;
      window.disqus_shortname  = shortname;
    }

    /**
     * Trigger the reset comment call
     * @param  {String} $location location service
     * @param  {String} id Thread id
     */
    function resetCommit($location, id) {
      window.DISQUS.reset({
        reload: true,
        config : function() {
          this.page.identifier = id;
          this.page.url        = $location.absUrl();
        }
      });
    }

    /**
     * Adds disqus script tag to header.
     * Initializes default values for url and disqus thread id.
     *
     * @param {Object} $location location
     * @param {String} id disqus thread id
     */
    function buildCommit($location, id) {
      var shortname = getShortname(),
          container = getScriptContainer();

      // If it already has a script tag in place then lets not do anything
      // This might happen if the user changes the page faster than then disqus can load
      if (hasScriptTagInPlace(container, shortname)) {
        return;
      }

      // Writes disqus global
      setGlobals(id, $location.absUrl(), shortname);

      // Build the script tag and append it to container
      container.appendChild(buildScriptTag(shortname));
    }


    /**
     * @param {String} sname shortname
     */
    this.setShortname = function(sname) {
      shortname = sname;
    };

    // Provider constructor
    this.$get = [ '$location', function($location) {

      /**
       * Resets the comment for thread.
       * If disqus was not defined then it will add disqus to script tags.
       * If disqus was initialized earlier then it will just use disqus api to reset it
       *
       * @param  {String} id required thread id
       */
      function commit(id) {
        if (!angular.isDefined(getShortname())) {
          throw new Error('No disqus shortname defined');
        } else if (!angular.isDefined(id)) {
          throw new Error('No disqus thread id defined');
        } else if (angular.isDefined(window.DISQUS)) {
          resetCommit($location, id);
        } else {
          buildCommit($location, id);
        }
      }

      // Expose public api
      return {
        commit       : commit,
        getShortname : getShortname
      };
    }];
 });

  disqusModule.directive('disqus', [ '$disqus', function($disqus) {

    return {
      restrict : 'AC',
      replace  : true,
      scope    : {
        id : '=disqus',
      },
      template : '<div id="disqus_thread"></div>',
      link: function link(scope, element, attr) {
        scope.$watch('id', function(id) {
          if (angular.isDefined(id)) {
            $disqus.commit(id);
          }
        });
      }
    };
  }]);

})(angular, this);
