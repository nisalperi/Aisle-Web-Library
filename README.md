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




