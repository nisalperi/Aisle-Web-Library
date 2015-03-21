# Aisle-Web-Library
JavaScript Library used in the Aisle Web application. Includes Views, Routers, a DataStore object etc.

##Using the Router Object
Router object uses HTML History API to specify handlers related to specific paths.

###Setting up the router
`var router = new Router();`

###Defining a path
`router.when(path,handler);`

Parameters are send as the first argument for the handler function. Parameters should be defined with relative path.

````
router.when('/tag/:tag_id', function(params) {
  // params object contains the attribute tag_id with the respective tag_id according to the path
  // handler function
});
````

##Activating the router
``router.activateRouter();``

##router.goTo()

``router.goTo(url);``
Redirects the user to given url and runs the attached handler.

##Using Views

Views can be used to seperate your UI into different components, and encapsulate data related to a specific component. To define a view use the ``Library.defineView()`` function (explained below) and to create an instance of a view use the ``Library.createElement()`` function.

###``Library.defineView()``





