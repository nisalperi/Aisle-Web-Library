# Aisle-Web-Library
JavaScript Library used in the Aisle Web application. Includes Views, Routers, a DataStore object etc.

## Using the Router Object
Router object maps handlers to paths. Uses the History API.

### Setting up the router
```javascript
var router = new Router();
```

### Defining a path
```javascript
router.when(path,handler);
```

`params` object is sent as the first argument of the handler function. Parameters should be specified with the relative path.

```javascript
router.when('/tag/:tag_id', function(params) {
  console.log(params.tag_id); //logs the tag_id
});
```

### Activating the router
After all the paths and handlers are defined, use the `router.activateRouter()` function.
```javascript
router.activateRouter();
```

### Directing the user to a specific path
```javascript
router.goTo(url);
```

### Other `router` methods

```javascript
router.back();
```
```javascript
router.refresh();`
```

## `DataStore` object
`DataStore` is a key,value datastorage which supports caching using the `LocalStorage`. It handles data overflows as well.

### Creating Datastore
```javascript
var ImageStore = new DataStore('images', {
    limit: 3500000, // Max number of characters stored in the LocalStorage
    localcache: true
});
```
### Accessing data
```javascript
var data = ImageStore.get(id);
```

### Setting data
```javascript
ImageStore.set(id, image_data);
```

##Using Views

Views can be used to seperate your UI into different components, and encapsulate data related to those specific component. To define a view, use the `Library.defineView()` function (explained below). To create an instance of a view, use the `Library.createElement()` function.

###`Library.defineView()`

The first parameter to the `Library.defineView()` function is the view name, and the second parameter is an object which contains a few methods and attributes by default.

- **`render: function(){}`**  Should return a string which will be appended to the DOM when `view_instance.render()` function is called, or returned when `view_instance.getHTML()` is called.

- **`events: function(){}`** This function will be called after `view_instance.render()` function is called. Should contain event listeners and other related functions for the view.

- **`event_queue: Array`** Contains functions to be called after `view_instance.render()` is called. *Useful when using `view_instance.getHTML()` method.* Can be manipulated in the same way in which elements are manipulated to an array.

**Example: Defining the view `loading-bar`**

```javascript

Library.defineView('loading-bar', (function() {
  return {
      render: function(data) {
          return _.parser('<div id="loading-bar-status"></div>');
      },
      events: function() {
          $('#loading-bar-status').css({
              width: '0%'
          });
      },
      progress: function(current, full) {
          var tmp = (current / full) * 100;
          $('#loading-bar-status').animate({
              width: tmp + '%'
          }, 100, function() {
              if (tmp == 100) {
                  $('#loading-bar-status').css({
                      width: '0px'
                  });
              }
          });
      }
  }
  })());
```

###`Library.createElement()`

`Library.createElement()` is used to create an instance of a View. The method takes a single object as the argument. The parameter object contains the following attributes.

- **`name: string`**  Name of the View. **Required**
- **`id:string`** ID to identify this particular instance. **Required**
- **`elem: string(jQuery selector)`** DOM Element(s) to which this new instance should be appended after `view_instance.render()` is called. **Optional**
- **`wrap: boolean`* If `true`, the content will be wrapped inside inside a div with an ID generated using a combination of the instance name, instance id, and view name. Also the instance will only accessible within the scope of the instance object. If `false`, the instance could be accessed from `Library.view_instances[instance_id]`, globally. **Default:true**

**Example: Creating an instance of the view `loading-bar` defined earlier in this document.**

```javascript
Library.createElement({
    name: 'loading-bar',
    id: 'loading-bar-top',
    elem: '#loading-bar',
    wrap: false
}).render({});
```

### `View` Object

### `view_object.render(data)`
Renders and appends content of the view as specified using the `Library.defineView()` method. Data contains variable data for the instance and functions that can be used by the `event()` method of the view. 

### `view_object.getHTML(data)`
Similar to `view_object.render()`, but returns a string with generated content rather than appending it to the DOM. Might have to append the `view_instance` to the `event_queue` of the parent view.

## License 

The MIT License (MIT)
[OSI Approved License]
The MIT License (MIT)

Copyright (c) 2015 Nisal Periyapperuma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
