/* 
 * angular-disqus 1.1.0
 * http://github.com/kirstein/angular-disqus
 * 
 * Licensed under the MIT license
 */
(function (angular, window) {
	'use strict';

	var disqusModule = angular.module('ngDisqus', [ ]);

	/**
	 * $disqus provider.
	 */
	disqusModule.provider('$disqus', function() {
		var TYPE_EMBED = 'embed.js'; // general disqus embed script
		var TYPE_COUNT = 'count.js'; // used for count

		// Placeholder for the disqus shortname
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
		 * @return {String} disqus shortname
		 */
		function getLanguage() {
			return language || window.disqus_language;
		}


		/**
		 * @param {String} shortname disqus shortname
		 * @param {String} file file name to add.
		 * @return {String} disqus embed src with embedded shortname
		 */
		function getScriptSrc(shortname, file) {
			return '//' + shortname + '.disqus.com/' + file

		}

		/**
		 * Builds the script tag
		 *
		 * @param {String} src script source
		 * @return {Element} script element
		 */
		function buildScriptTag(src) {
			var script = document.createElement('script');

			// Configure the script tag
			script.type  = 'text/javascript';
			script.async = true;
			script.src   = src;

			return script;
		}


		/**
		 * Builds the script tag using text property
		 *
		 * @param {String} text script source
		 * @return {Element} script element
		 */
		function buildScriptTagText(text) {
			var script = document.createElement('script');

			// Configure the script tag
			script.type  = 'text/javascript';
			script.async = true;
			script.text   = text;

			return script;
		}

		/**
		 * Searches the given element for defined script tag
		 * if its already there then return true. Otherwise return false
		 *
		 * @param {Element} element element to search within
		 * @param {String} scriptSrc script src
		 * @return {Boolean} true if its there, false if its not
		 */
		function hasScriptTagInPlace(container, scriptSrc) {
			var scripts   = container.getElementsByTagName('script'),
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
		function setGlobals  (id, url, shortname,language) {
			window.disqus_identifier = id;
			window.disqus_url        = url;
			window.disqus_shortname  = shortname;

			//attach language to window object if it's defined
			if(angular.isDefined(language)){
				window.disqus_language  = language;
			}

		}


		/**
		 * Refreshes the count from DISQUSWIDGETS.
		 */
		function getCount() {
			var widgets = window.DISQUSWIDGETS;
			if (widgets && angular.isFunction(widgets.getCount)) {
				widgets.getCount();
			}
		}

		/**
		 * Trigger the reset comment call
		 * @param  {String} $location location service
		 * @param  {String} id Thread id
		 */
		function resetCommit($location, id,language) {
			window.DISQUS.reset({
				reload: true,
			config : function() {

				console.log("reset!") ;
				console.log(language);
				this.page.identifier = id;
				this.page.url        = $location.absUrl();
				if(angular.isDefined(language)){
					this.language =   language;
				}
			}
			});
		}

		/**
		 * Adds disqus script tag to header by its type.
		 * If the script tag already exists in header then wont continue.
		 *
		 * Adds script tags by their type.
		 * Currently we are using two types:
		 *  1. count.js
		 *  2. embed.js
		 *
		 * @param {String} shortname disqus shortname
		 * @param {String} type disqus scirpt tag type
		 */
		function addScriptTag(shortname, type) {
			var container = getScriptContainer(),
			    scriptSrc = getScriptSrc(shortname, type);

			// If it already has a script tag in place then lets not do anything
			// This might happen if the user changes the page faster than then disqus can load
			if (hasScriptTagInPlace(container, scriptSrc)) {
				return;
			}

			// Build the script tag and append it to container
			container.appendChild(buildScriptTag(scriptSrc));




			//build the language script
			var script = buildScriptTagText('var disqus_config = function () {    this.language = window.language; };');

			//append it after disqus load just to configure the language initially
			container.appendChild(script);


		}


		/**
		 * @param {String} sname shortname
		 */
		this.setShortname = function(sname) {
			shortname = sname;
		};

		/**
		 * @param {String} sname shortname
		 */
		this.setLanguage = function(language) {
			language = language;
		};

		// Provider constructor
		this.$get = [ '$location','$routeParams', function($location,$routeParams) {

			/**
			 * Resets the comment for thread.
			 * If disqus was not defined then it will add disqus to script tags.
			 * If disqus was initialized earlier then it will just use disqus api to reset it
			 *
			 * @param  {String} id required thread id
			 */
			function commit(id) {

				var shortname = getShortname();

				if (!angular.isDefined(shortname)) {
					throw new Error('No disqus shortname defined');
				} else if (!angular.isDefined(id)) {
					throw new Error('No disqus thread id defined');
				} else if (angular.isDefined(window.DISQUS)) {
					resetCommit($location, id,language);
				} else {
					setGlobals(id, $location.absUrl(), shortname);
					if(angular.isDefined(language)){

						setGlobals(id, $location.absUrl(), shortname,language);

					}
					addScriptTag(shortname, TYPE_EMBED);
				}
			}

			/**
			 * Loads the comment script tag and initiates the comments.
			 * Sets the globals according to the current page.
			 *
			 * If the embed disqus is not added to page then adds that.
			 *
			 * @param {Stirng} id thread id
			 */
			function loadCount(id) {
				setGlobals(id, $location.absUrl(), shortname,$routeParams.lang);
				addScriptTag(getShortname(), TYPE_EMBED);
				addScriptTag(getShortname(), TYPE_COUNT);
				getCount();
			}

			// Expose public api
			return {
				commit       : commit,
					     getShortname : getShortname,
					     getLanguage : getLanguage,
					     loadCount    : loadCount
			};
		}];
	});

	/**
	 * Disqus thread comment directive.
	 * Used to display the comments block for a thread.
	 */
	disqusModule.directive('disqus', [ '$disqus', function($disqus) {

		return {
			restrict : 'AC',
		replace  : true,
		scope    : {
			id : '=disqus',
		lang: '=language'
		},
		template : '<div id="disqus_thread"></div>',
		link: function link(scope) {
			//support for watch collection isn't determined yet ...
			scope.$watch('id', function(id){
				if (angular.isDefined(id)) {
					$disqus.commit(id);

				}

			});
			scope.$watch('lang', function(lang){
				//optional language support
				if(angular.isDefined(lang)){
					$disqus.commit(scope.id,lang);
				}


			});
		}
		};
	}]);

	/**
	 * Disqus comment count directive.
	 * Just wraps `disqus-identifier` to load the disqus comments count script tag on page
	 */
	disqusModule.directive('disqusIdentifier', [ '$disqus', function($disqus) {
		return {
			restrict : 'A',
		link     : function(scope, elem, attr) {
			$disqus.loadCount(attr.disqusIdentifier);
		}
		};
	}]);

})(angular, this);
