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
          }).toThrowError('No disqus shortname defined');
        }));

        it('should throw when no disqus shortname defined (on window)', inject(function($disqus, $window) {
          $window.disqus_shortname = undefined;
          expect(function () {
            $disqus.commit();
          }).toThrowError('No disqus shortname defined');
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
          }).toThrowError('No disqus thread id defined');
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

      it ('should reset the thread with correct url', inject(function($disqus, $window, $location) {
        var spy  = jasmine.createSpy('reset spy');
        var data = {
          page : {}
        };

        $disqusProvider.setShortname('shortname');
        $window.DISQUS = {
          reset : function(opts) {
            opts.config.call(data);
          }
        };

        $disqus.commit('$location test');
        expect(data.page.url).toBe($location.absUrl());
      }));

      it('should reset the thread if initialized', inject(function($disqus, $window) {
        $disqusProvider.setShortname('shortname');

        // Overwrite the reset method
        $window.DISQUS = {
          reset : function(){}
        };

        spyOn($window.DISQUS, 'reset');

        $disqus.commit('wat');
        expect($window.DISQUS.reset).toHaveBeenCalled();
        expect($window.DISQUS.reset.calls.count()).toBe(1);

        // Validate arguments
        expect($window.DISQUS.reset.calls.mostRecent().args[0].reload).toBe(true);
        expect($window.DISQUS.reset.calls.mostRecent().args[0].config).toEqual(jasmine.any(Function));
      }));
    });

    describe('#getShortname', function() {
      it('should contain #getShortname method', inject(function($disqus) {
        expect($disqus.getShortname).toEqual(jasmine.any(Function));
      }));
    });

    describe('#loadCount', function() {
      it('should should contain #loadCount method', inject(function($disqus) {
        expect($disqus.loadCount).toEqual(jasmine.any(Function));
      }));

      it('should set globals on initializing', inject(function($disqus, $window, $location) {
        $disqusProvider.setShortname('shortname');
        $disqus.loadCount('test');

        expect($window.disqus_shortname).toEqual('shortname');
        expect($window.disqus_identifier).toEqual('test');
        expect($window.disqus_url).toEqual($location.absUrl());
      }));

      it('should add embed script tag if its not added', inject(function($disqus) {
        $disqusProvider.setShortname('shortname');
        $disqus.loadCount('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should add count script tag if its not added', inject(function($disqus) {
        $disqusProvider.setShortname('shortname');
        $disqus.loadCount('test');
        var tags = $('script[type="text/javascript"][src="//shortname.disqus.com/count.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should add only one script tag for embed and count', inject(function($disqus) {
        $disqusProvider.setShortname('shortname');
        $disqus.loadCount('test');
        $disqus.loadCount('test');
        $disqus.loadCount('test');

        var count = $('script[type="text/javascript"][src="//shortname.disqus.com/count.js"]');
        var embed = $('script[type="text/javascript"][src="//shortname.disqus.com/embed.js"]');

        expect(count.length).toBe(1);
        expect(embed.length).toBe(1);
      }));

      it('should ask getCount from DISQUSWIDGETS on loading', inject(function($disqus, $window) {
        $disqusProvider.setShortname('shortname');
        $window.DISQUSWIDGETS = {
          getCount : jasmine.createSpy()
        };

        $disqus.loadCount();
        expect($window.DISQUSWIDGETS.getCount).toHaveBeenCalled();
      }));
    });
  });

  describe('directive', function() {
    var ID = 'disqus_thread',
    $compile, $rootScope, $scope;

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile   = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
    }));

    describe('thread directive', function() {

      it('should compile as class', function() {
        $disqusProvider.setShortname('shortname');
        var element = $compile('<div class="disqus: \'test-id\'"></div>')($scope);

        $scope.$digest();

        expect(element.isolateScope().id).toEqual('test-id');
        expect(element.attr('id')).toEqual(ID);
      });

      it('should compile as attribute', function() {
        $disqusProvider.setShortname('shortname');
        var element = $compile('<div disqus="\'test-id\'"></div>')($scope);
        $scope.$digest();

        expect(element.isolateScope().id).toEqual('test-id');
        expect(element.attr('id')).toEqual(ID);
      });

      it('should trigger commit if id and title is defined', inject(function($disqus) {
        spyOn($disqus, 'commit');
        $compile('<div disqus="\'test-id\'" title="\'test\'"></div>')($scope);
        $scope.$digest();

        expect($disqus.commit).toHaveBeenCalledWith('test-id', 'test');
      }));

      it('should trigger commit if id changes', inject(function($window, $disqus, $rootScope) {
        spyOn($disqus, 'commit');
        $rootScope.id = 'test-id';
        $compile('<div disqus="id"></div>')($scope);

        $rootScope.id = 'hello-kitty';
        $rootScope.$apply();

        expect($disqus.commit).toHaveBeenCalledWith('hello-kitty', undefined);
      }));
    });

    describe('disqus-identifier directive', function() {

      it('should trigger disqusProvider loadCount', inject(function($disqus) {
        spyOn($disqus, 'loadCount');
        $compile('<div data-disqus-identifier="id"></div>')($scope);
        $scope.$digest();

        expect($disqus.loadCount).toHaveBeenCalled();
      }));

      it('should trigger disqusProvider loadCount with given id', inject(function($disqus) {
        spyOn($disqus, 'loadCount');
        $compile('<div data-disqus-identifier="id"></div>')($scope);
        $scope.$digest();

        expect($disqus.loadCount).toHaveBeenCalledWith('id');
      }));

    });
  });
});
