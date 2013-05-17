describe('Angular-disqus', function() {

  beforeEach(module('ngDisqus'));

  describe('$disqus', function() {

    describe('#commit', function() {
      it('should throw when no id is defined', inject(function($disqus, $window) {
        $window.disqus_shortname = 'karl';

        expect(function () {
          $disqus.commit(undefined);
        }).toThrow('No disqus thread id defined');
      }));

      it('should write the script tag to head if not initialized', inject(function($disqus, $window) {
        $window.disqus_shortname = 'test';

        $disqus.commit('test');
        var tags = $('script[type="text/javascript"][src="//test.disqus.com/embed.js"]');

        expect(tags.length).toBe(1);
      }));

      it('should reset the thread if initialized', inject(function($disqus, $window) {
        var spy = jasmine.createSpy('disqus reset spy');

        $window.disqus_shortname = 'kala';

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

    describe('#shortname', function() {
      it('should set the shortname', inject(function($disqus, $window) {
        $disqus.shortname('paul');
        expect($window.disqus_shortname).toBe('paul');
      }));

      it('should return the shortname', inject(function($disqus, $window) {
        $window.disqus_shortname = 'paula';
        $disqus.shortname();
        expect($window.disqus_shortname).toBe('paula');
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


    it('should compile as element', function() {
      var element = compileHtml('<disqus></disqus>');
      expect(element.attr('id')).toEqual(ID);
    });

    it('should compile as attribute', function() {
      var element = compileHtml('<div disqus></div>');
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
