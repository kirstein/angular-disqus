module.exports = function(config) {
  config.set({
    basePath: '',
    files: [
      'https://code.jquery.com/jquery-3.1.1.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js',
      'https://code.angularjs.org/1.5.8/angular-mocks.js',

      // The library itself
      'src/angular-disqus.js',

      'test/**.spec.js'
    ],
    growl: true,
    colors: true,
    singleRun: true,
    autoWatch: false,
    frameworks: ['jasmine'],
    plugins: ['karma-phantomjs-launcher', 'karma-jasmine', 'karma-nyan-reporter'],
    browsers: ['PhantomJS'],
    reporters: ['nyan'],
    nyanReporter: {
      suppressErrorReport: false,
      numberOfRainbowLines : 4
    }
  });
};