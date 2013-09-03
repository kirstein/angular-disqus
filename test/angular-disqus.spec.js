describe('Angular-disqus', function() {
  var $disqusProvider;

  beforeEach(module('ngDisqus'));

  // Get the provider for testing
  beforeEach(function() {
    var mod = angular.module('providerTest', []).config(function(_$disqusProvider_) {
      $disqusProvider = _$disqusProvider_;
    });

    module(mod.name);
    inject(function() {});
  });

  describe ('$disqusProvider', function() {
    it ('should contain the shortname function', function() {
      expect($disqusProvider.setShortname).toEqual(jasmine.any(Function));
    });

    it ('should set the shortname', inject(function($disqus) {
      $disqusProvider.setShortname('test-name');
      expect($disqus.getShortname()).toEqual('test-name');
    }));
  });

  describe('$disqus', function() {

    describe('#commit', function() {

      describe ('exception throwing', function() {
        it('should throw when no disqus shortname defined', inject(function($disqus, $window) {
          expect(function () {
            $disqus.commit();
          }).toThrow('No disqus shortname defined');
        }));

        it('should throw when no disqus shortname defined (on window)', inject(function($disqus, $window) {
          $window.disqus_shortname = undefined;
          expect(function () {
            $disqus.commit();
          }).toThrow('No disqus shortname defined');
        }));

        it('should not throw when disqus_shortname is defined on window', inject(function($disqus, $window) {
          $window.disqus_shortname = 123;
          expect(function () {
            $disqus.commit();
          }).not.toThrow('No disqus shortname defined');
        }));

        it('should throw when no id is defined', inject(function($disqus, $window) {
          $disqusProvider.setShortname('defined');
          expect(function () {
            $disqus.commit(undefined);
          }).toThrow('No disqus thread id defined');
        }));
      });

      it('should write the script tag to head if there are other script tags present', inject(function($disqus) {
        var el = $('<script></script>', {
          src : 'http://www.google.com'
        }).appendTo((document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]));

        $disqusProvider.setShortname('shortname');
        $disqus.commit('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should write the script tag to head if not initialized (using provider)', inject(function($disqus) {

        $disqusProvider.setShortname('shortname');
        $disqus.commit('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should write the script tag to head if not initialized (using $window.disqus_shortname)', inject(function($disqus) {

        $disqusProvider.setShortname('shortname');
        $disqus.commit('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should write ONLY ONE script tag', inject(function($disqus) {

        $disqusProvider.setShortname('shortname');
        $disqus.commit('test');
        $disqus.commit('test');
        $disqus.commit('test');
        $disqus.commit('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should write default values to window', inject(function($disqus, $window, $location) {
        $disqusProvider.setShortname('shortname');
        $disqus.commit('test');

        expect($window.disqus_shortname).toEqual('shortname');
        expect($window.disqus_identifier).toEqual('test');
        expect($window.disqus_url).toEqual($location.absUrl());
      }));

      it('should reset the thread if initialized', inject(function($disqus, $window) {
        var spy = jasmine.createSpy('disqus reset spy');

        $disqusProvider.setShortname('shortname');
        // Overwrite the reset method
        $window.DISQUS = {
          reset : spy
        };

        $disqus.commit('wat');
        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(1);

        // Validate arguments
        expect(spy.mostRecentCall.args[0].reload).toBe(true);
        expect(spy.mostRecentCall.args[0].config).toEqual(jasmine.any(Function));
      }));
    });

    describe('#getShortname', function() {
      it('should contain #getShortname method', inject(function($disqus, $window) {
        expect($disqus.getShortname).toEqual(jasmine.any(Function));
      }));
    });
  });

  describe('directive', function() {

    function compileHtml(html) {
      var elem = $compile(html)($rootScope);
      $rootScope.$digest();

      return elem;
    }

    var ID = "disqus_thread", $compile, $rootScope;

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile   = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should compile as class', function() {
      var element = compileHtml('<div class="disqus: \'test-id\'"></div>');
      expect(element.scope().id).toEqual('test-id');
      expect(element.attr('id')).toEqual(ID);
    });

    it('should compile as attribute', function() {
      var element = compileHtml('<div disqus="\'test-id\'"></div>');
      expect(element.scope().id).toEqual('test-id');
      expect(element.attr('id')).toEqual(ID);
    });

    it('should trigger commit if id is defined', inject(function($disqus) {
      $disqus.commit = jasmine.createSpy('commit call spy');
      compileHtml('<div disqus="\'test-id\'"></div>');

      expect($disqus.commit).toHaveBeenCalledWith('test-id');
    }));

    it('should trigger commit if id changes', inject(function($window, $disqus, $rootScope) {
      $disqus.commit = jasmine.createSpy('commit call spy');
      $rootScope.id = 'test-id';
      compileHtml('<div disqus="id"></div>');

      $rootScope.id = 'hello-kitty';
      $rootScope.$apply();

      expect($disqus.commit).toHaveBeenCalledWith('hello-kitty');
    }));

  });
});
