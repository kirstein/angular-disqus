# angular-disqus [![Build Status](https://travis-ci.org/kirstein/angular-disqus.png)](https://travis-ci.org/kirstein/angular-disqus)

 > ```angular.js``` and ```disqus``` integration made easy

A set of directive(s) and services to simplify the life of developers.

### Getting started
---
Add ```ngDisqus``` to required modules list

```
    angular.module('myApp', [ …, 'ngDisqus' ]);
```

Register your ```shortname```:

  1. by just adding it to ```window.disqus_shortname```
  2. by configure with ```$disqusProvider``` and registering it via ```$disqusProvider.setShortname```

Add comments to threads by using the ```disqus``` directive

```
    <!-- directive can be used as an attribute -->
    <div disqus="id"></div>

    <!-- directive can be used as a class attribute -->
    <div class="disqus : id"></div>
```

### Need to know
---
Disqus will only update on sites which use `hashbang` ( `#!` ).  
Thats not something I have control over, so in order to use this plugin, please make sure that you have your `$locationProvider.hashPrefix('!')` set.


### Disqus identifiers
---
Disqus identifiers must be passed to the directive as as expressions. If the plan is to pass a constant then one must make sure that the constant is wrapped in `'` apostrophes (_disqus="'id'""_)

### Comment count
---
Angular-disqus will display comment using the `data-disqus-identifier` attribute.

Example on how to show the comment count:

```
  <a href="#!/test/1">test page 1</a> |
  <a href="#!/test/1" data-disqus-identifier="1"></a>
```

This will replace the content of the anchor tag with given comment count.

There is some talk of this in the [disqus spec][1]

### API
---

1. ```$disqus#getShortname``` getter for the current shortname
2. ```$disqus#comment``` will reset comments (or generate comments if needed)
3. ```$disqusProvider#setShortname``` setter for shortname
4. ```$loadCount``` initiates the thread comment count loading (generally should not be used)

### Devel
---

```
  npm install
  bower install
  grunt test
  grunt build
```

### License
---

MIT

[1]: http://help.disqus.com/customer/portal/articles/565624-tightening-your-disqus-integration#using-an-identifier 
