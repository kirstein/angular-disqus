# angular-disqus [![Build Status](https://travis-ci.org/kirstein/angular-disqus.png)](https://travis-ci.org/kirstein/angular-disqus)

 > ```angular.js``` and ```disqus``` integration made easy

A set of directive(s) and services to simplify the life of developers.

### NOTICE!

This library is no longer activly maintained by me. However, If you feel like you should be the one who will continue maintaing it then please contact me.

### Getting started
---
**(1)** Add ```ngDisqus``` to required modules list:
```
   var myApp = angular.module('myApp', ['ngDisqus']);
```
**(2)** Register your ```shortname```:

*This is the unique identifier assigned to your Disqus app, can be found on disqus.com > Admin. https://shortname.disqus.com*

```
   myApp.config(function($disqusProvider){
      $disqusProvider.setShortname(shortname);
   });
```
**(3)** Add comments to threads by using the ```disqus``` directive:

```
    <!-- directive can be used as an attribute -->
    <div disqus="id"></div>

    <!-- directive can be used as a class attribute -->
    <div class="disqus: id"></div>
```

### Additional Changes
---
Disqus will only work on sites which use `hashbang` ( `#!` ).  A valid url looks like this, ```http://localhost:8000/#!/home/comments/10```

Update config block liks this:

```
   myApp.config(function($disqusProvider, $locationProvider){
      $locationProvider.hashPrefix('!');
   })
```
This changes your link from ```http://localhost:8000/#/home/comments/10``` to the valid form above.

### Disqus identifiers
---
Disqus identifiers must be passed to the directive as as expressions. If the plan is to pass a variable then one must make sure that the variable is wrapped in `'` apostrophes (_disqus="'id'""_)

### Comment count
---
Angular-disqus will display comment using the `data-disqus-identifier` attribute.

Normal Link:
```
  <a href="#!/home/comments/10" data-disqus-identifier="randomString"></a>
```

Ui router:

```
  <a ui-sref="home.comments.view({id: video.id})" data-disqus-identifier="randomString"></a>
```

This will replace the content of the anchor tag with given comment count.

There is some talk of this in the [disqus spec][1]

### API
---

1. ```$disqus#getShortname``` getter for the current shortname
2. ```$disqus#comment``` will reset comments (or generate comments if needed)
3. ```$disqusProvider#setShortname``` setter for shortname
4. ```$loadCount``` initiates the thread com`ment count loading (generally should not be used)

### Devel
---

```
  npm install
  bower install angular-disqus --save
  grunt test
  grunt build
```

### License
---

MIT

[1]: http://help.disqus.com/customer/portal/articles/565624-tightening-your-disqus-integration#using-an-identifier 
