(function(angular) {
  // Add disqus as dependency
  var module = angular.module('demoApp', [ 'ngRoute', 'ngDisqus' ]);

  module.config(function($disqusProvider, $locationProvider, $routeProvider) {
    $disqusProvider.setShortname('angulardisqusdemo'); // Configure the disqus shortname
    $locationProvider.hashPrefix('!');                 // Disqus needs hashbang in urls. If you are using pushstate then no need for this.

    // Configure your amazing routes
    $routeProvider.when('/test/:id', {
      templateUrl : 'app/partials/testTpl.html',
      controller  : function($scope, $routeParams) {
        $scope.id = $routeParams.id;
      }
    });
  });

})(angular);
