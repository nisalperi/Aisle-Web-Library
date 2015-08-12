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

`param` object is sent as the first argument of the handler function. Parameters should be specified with the relative path.

```javascript
router.when('/tag/:tag_id', function(params) {
  // params object contains the attribute tag_id with the respective tag_id according to the path
  // handler function
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

Views can be used to seperate your UI into different components, and encapsulate data related to those specific component. To define a view use the `Library.defineView()` function (explained below) and to create an instance of a view use the `Library.createElement()` function.

###`Library.defineView()`





