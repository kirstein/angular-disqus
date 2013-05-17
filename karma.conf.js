files = [

  JASMINE,
  JASMINE_ADAPTER,

  'components/jquery/jquery.js',
  'components/angular/angular.js',
  'components/angular-mocks/angular-mocks.js',

  // The library itself
  'src/angular-disqus.js',

  'test/**.spec.js'
];

growl     = true;
colors    = true;
singleRun = true;
autoWatch = false;
browsers  = ['PhantomJS'];
reporters = ['progress', 'growl'];
