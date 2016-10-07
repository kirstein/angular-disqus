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

**(4)** Add comments to threads by using the ```disqus``` directive:

```
    <!-- directive can be used as an attribute -->
    <div disqus="id" title="title"></div>

    <!-- directive can be used as a class attribute -->
    <div class="disqus: id, title: title"></div>
```

### Additional Changes
---
**(1)** Change ```hashPrefix```:
Disqus will only work on sites which use `hashbang` ( `#!` ).  A valid url looks like this, ```http://localhost:8000/#!/home/comments/10```

Update config block liks this:

```
   myApp.config(function($disqusProvider, $locationProvider){
      $locationProvider.hashPrefix('!');
   })
```
This changes your link from ```http://localhost:8000/#/home/comments/10``` to the valid form above.

**(2)** Register your user with ```SSO(Single Sign-On)```:

*Single sign-on (SSO) allows users to sign into a site and fully use Disqus Comments without again authenticating with Disqus. SSO will create a site-specific user profile on Disqus so as not to clash with existing users of Disqus.*
*See more: https://help.disqus.com/customer/portal/articles/236206-single-sign-on*
```
   myApp.run(function(disqusService){
      disqusService.setSso({
        remote_auth_s3: 'YOUR REMOTE AUTH',
        api_key: 'YOUR PUBLIC KEY'
      });
   });
```

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
4. ```$loadCount``` initiates the thread comment count loading (generally should not be used)
5. ```disqusService#setSso``` authenticate your user in the Disqus platform

### Devel
---

```
  npm install
  npm run test
```

### License
---

MIT

[1]: http://help.disqus.com/customer/portal/articles/565624-tightening-your-disqus-integration#using-an-identifier 
