'use strict'

/*
    DESCRIPTION : Housekeeping and general functions used in the library
    DEPENDENCIES : jQuery
    NOTE : This library uses features like History API. This might not support older browsers.
    CREATOR : Nisal Periyapperuma

    INITIAL DATE : 02.08.2015
    CONTRIBUTORS : Nisal Periyapperuma

    "OBJECTS":  '_' -> Contains basic housekeeping functions including: parsing, existance check etc.
                'lib' -> Main Object which contains almost all the necessary functions 
                'View' -> Defining views, creating instances, rendering etc.
                'Routers' -> Routes, handlers etc.
                'AJAXObject' -> Interface to the jQuery AJAX object
                'DataStore' -> get(),set() methods and caching in the localstorage
*/

function _() {};

// Check if a value of a variable is undefined
_.prototype.exists = function(val) {
    if (typeof val === 'undefined' || val === null) return false;
    else return true;
}

/*
    Name: _.parser
    Description: parse a string with the template and a scope object (scope) returns a parsed string.
*/

// Escape string
_.prototype.escape = function(html_template) {
    var new_str = '';
    for (var i = 0; i < html_template.length; i++) {
        if (html_template[i] === '<') {
            new_str += '&lt;';
            continue;
        }
        if (html_template[i] === '>') {
            new_str += '&gt;';
            continue;
        }
        new_str += html_template[i];
    }
    return new_str;
};

// Dealing with multi-dimentional arrays and objects in parsing
_.prototype.getValues = function(arr, data) {
    if (arr.length === 1) {
        if (_.exists(data) && _.exists(data[arr[0]])) {
            return data[arr[0]];
        }
        return '';
    } else {
        return this.getValues(arr.splice(1, arr.length), data[arr[0]]);
    }
}

// Escaped values of the field
_.prototype.val = function(DOM_element) {
    return this.escape($(DOM_element).val());
}

// _.parser()
// Passing templates and returning text generated using sent in values

_.prototype.parser = function(str, scope) {
    var i = 0;
    var _parsed = "";

    while (i < str.length - 4) {
        //if start of the {{}} sector
        if (str[i] === '{' && str[i + 1] === '{') {
            var s = i + 2;
            while (i < str.length - 1) {
                if (str[i] === '}' && str[i + 1] === '}') {
                    //when found
                    var _tmp_ref = str.substr(s, i - s);
                    var _tmp_attr_array = _tmp_ref.split('.');

                    _parsed += this.getValues(_tmp_attr_array, scope);

                    //var _tmp_object = scope;
                    i++;
                    break;
                }
                i++;
            }
        } else {
            _parsed += str[i];
        }
        i++;
        if (i === str.length - 4 && str[i] != '{') {
            _parsed += str.substr(i, 4);
        }
    }
    return _parsed;
}

/*
    LOOPING FUNCTIONS
*/

_.prototype.forEachAttr = function(object, callback) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            callback(object[property]);
        }
    }
}

_.prototype.min = function(one, two) {
    if (two > one) return one;
    else return two;
}

_.prototype.max = function(one, two) {
    if (two > one) return two;
    else return one;
}

_.prototype.pathArray = function(str) {
    var browser_url_array = str.split('/');
    if (browser_url_array.length > 0) {
        browser_url_array = browser_url_array.slice(1, browser_url_array.length);
    }
    return browser_url_array;
}

_.prototype.dynamicDate = function(old) {
    var diff = Date.now() - new Date(old).getTime(); //in milliseconds
    var seconds = Math.ceil(diff / 1000);
    var minutes = Math.ceil(seconds / 60);
    var hours = Math.ceil(minutes / 60);
    var days = Math.ceil(hours / 24);
    var months = Math.ceil(days / 30);
    var years = Math.ceil(months / 12);

    if (seconds < 60) return "Just Now"; //just now
    if (minutes < 60) {
        if (minutes === 1) return "One minute ago";
        return minutes + " minutes ago"; //no of minutes
    }
    if (hours < 24) {
        if (hours === 1) return "One hour ago";
        return hours + " hours ago"; //no of hours
    }
    //no of days
    if (days < 30) {
        if (days === 1) return "One day ago";
        return days + ' days ago';
    }
    if (months < 12) {
        if (months === 1) return "One month ago";
        return months + ' months ago'; //no of months
    }
    if (years === 1) return "One year ago";
    return years + ' years ago'; //no of years
}

var _ = new _();

/*
    Name: unique queue
*/

function UniqueList() {
    this.list = {};
}

UniqueList.prototype.add = function(key, val) {
    if (typeof this.list[key] === 'undefined') {
        this.list[key] = val;
    } else {
        console.log("WARNING: Previous value at the key was replaced");
        this.list[key] = val;
    }
}

UniqueList.prototype.get = function(key) {
    return this.list[key];
}

UniqueList.prototype.all = function() {
    var results = [];
    for (var key in this.list) {
        if (this.list.hasOwnProperty(key)) {
            results.push(this.list[key]);
        }
    }
    return results;
}

/*
    Name: View
    Description: Functions and Structures related to Views
*/

function View(definition) {
    this._ = definition;
    this.id = this._.id;
}

View.prototype.render = function(data) {
    var tmp = this._.render(data);
    //parse the processed html
    var html = $.parseHTML(tmp);

    if (_.exists(this._.clearElement) && this._.clearElement === true) {
        $(this._.element).empty();
    }

    // Edited to support destorying
    // Date : 24th Feb 2015
    // If wrap element is not defined or set true, it's assumed to be true
    // If this.wrap is true the instance will be wrapped inside a DOM element with the ID before appending to the DOM

    if (_.exists(this.DOM_id) && this.wrap === true) {
        var tmp_container_template = '<div id="' + this.DOM_id + '"></div>';
        var tmp_container_html = $.parseHTML(tmp_container_template);

        // Remove existing DOM elements with the same ID
        $('#' + this.DOM_id).remove();

        // Append the new node to the defined DOM element
        $(this.element).append(tmp_container_html);

        // Append the generate HTML to the element with the DOM_ID
        $("#" + this.DOM_id).append(html);

    } else {
        // No wrapping. Simply append the generated html to the defined element
        $(this.element).append(html);
    }

    // Run the Events before return the element
    this._.events(data);
    this.data = data;

    return this;
}

View.prototype.getHTML = function(data) {
    return this._.render(data);
}

View.prototype.destroy = function() {
    if (_.exists(this.DOM_id)) {
        $('#' + this.DOM_id).remove();
    }
}

/*
    Name: Router
    Description: Functions and Structures related to Views
*/

function Router(properties) {
    this.routes = [];
    lib.prototype.router = this;
    // set avoid_refresh to true if you to redirect the user to an handler, 
    // but don't want to refresh the state after the user 
    this.avoid_refresh = false;
    this.appHistory = 0;
    this.queue = [];
    return this;
}

Router.prototype.when = function(pathStr, handler, refresh) {
    var refresh_val = true;
    if (_.exists(refresh) && refresh === false) refresh_val = false;
    this.routes.push({
        path: pathStr,
        handler: handler,
        refresh: refresh_val
    });
}

Router.prototype.runHandler = function(path, _from) {

    if (!_.exists(_from)) _from = null;
    var cur_path_array = _.pathArray(path);

    var found = false;

    for (var i = 0; i < this.routes.length; i++) {
        var tmp_router_array = _.pathArray(this.routes[i].path);

        if (tmp_router_array.length === cur_path_array.length) {
            var count = 0;
            var context = {};

            for (var j = 0; j < tmp_router_array.length; j++) {
                if (tmp_router_array[j][0] === ':') {
                    var tmp = tmp_router_array[j].substr(1, tmp_router_array[j].length - 1);
                    context[tmp] = cur_path_array[j];
                    count++;
                } else {
                    if (tmp_router_array[j] === cur_path_array[j]) {
                        count++;
                    }
                }
            }
            if (count === tmp_router_array.length) {
                this.routes[i].handler(context, _from);
                found = true;
            }
        }
    }
    if (!found) {
        console.log("WARNING: No handler found for the path!");
    }
    return found;
}

Router.prototype.goTo = function(path, hash) {
    var self = this;

    path = (path.split('#'))[0];

    if (_.exists(hash) && hash.length > 0) {
        path += '#' + hash;
    }

    var _prev = window.location.pathname;
    var _link = path;

    this.queue.push(_link);

    history.pushState(null, '', _link);
    this.appHistory++;

    var _new_link = window.location.pathname || null;

    if (_new_link && _prev !== _new_link) {
        self.runHandler(_new_link, 'link');
    }
}

Router.prototype.activateRouter = function() {
    this.appHistory = 0;

    // Self object contains the context of the router
    var self = this;

    $("html").delegate("a", "click", function(e) {
        var tmp_url = $(this).attr('href');
        if (tmp_url !== '' && tmp_url.length > 0) {
            self.goTo(tmp_url);
        }
        e.preventDefault();
    });

    $(document).ready(function() {
        if (!self.runHandler(window.location.pathname, 'load')) {
            self.goTo("/");
        }
    })

    window.addEventListener('popstate', function(event) {
        self.appHistory--;
        self.queue.pop();
        self.runHandler(window.location.pathname);
    });
}

Router.prototype.back = function() {
    if (this.appHistory <= 0) {
        this.goTo('/');
    } else {
        history.back();
    }
}

Router.prototype.last = function() {
    if (this.queue.length - 2 < 0) return '/';
    return this.queue[this.queue.length - 2];
}


/*
    Name : AJAX Object
    Description : Use to get resources from the Server using $.ajax
*/

function AJAXRequest(config, data) {
    config.data = data;
    return $.ajax(config);
}

/* 
    Name : DataStore
    Description : Data structuring for the application
                  Stores recurring resources...
                  Such as images/profile data etc.  
*/

function DataStore(name, config) {
    this.queue = [];

    var config = config || {};
    if (!_.exists(name)) {
        throw new Error('DataStore object should have a name');
    }

    this.store = {};
    this.char_length = 0;

    this.name = name;

    // Local Caching is enabled by default
    // Set config.localcache = false if you want to disable caching
    // Caching is done in the localStorage, overide this function and the set function to change this

    if (!_.exists(config.localcache)) {
        config.localcache = false;
    }

    if (!_.exists(config.limit)) config.limit = 500000;

    this.config = config;

    if (this.config.localcache) {
        var storage_string = localStorage.getItem(this.name);
        var tmp = JSON.parse(storage_string);
        if (tmp) {
            this.char_length = storage_string.length;
            this.store = tmp;
        }
        for (var d in tmp) {
            if (tmp.hasOwnProperty(d)) {
                this.queue.push(d);
            }
        }
    }
    return this;
}

DataStore.prototype._getStore = function() {
    return this.store;
}

DataStore.prototype._getQueue = function() {
    return this.queue;
}

DataStore.prototype._pushToQueue = function(id) {
    this.queue.push(id);
}

DataStore.prototype._inQueue = function(id) {
    for (var i = 0; i < this.queue.length; i++) {
        if (this.queue[i] === id) return true;
    }
    return false;
}


DataStore.prototype._removeOldestValue = function() {
    this.store = JSON.parse(localStorage.getItem(this.name));
    var id = this.queue.shift();
    delete this.store[id];
    localStorage.setItem(this.name, JSON.stringify(this.store));
    this.char_length = (localStorage.getItem(this.name)).length;
}

DataStore.prototype.set = function(id, val) {
    if (this.config.localcache) {
        var self = this;
        try {
            if (self.config.localcache) {
                if (typeof self.store[id] === 'undefined') {
                    if (self.char_length + val.length > self.config.limit) {
                        self._removeOldestValue();
                        console.log("Cache Overflow", self.name);
                        self.set(id, val);
                        return;
                    }
                } else {
                    if (self.char_length - self.store[id].length + val.length > self.config.limit) {
                        console.log("Cache Overflow", self.name);
                        self._removeOldestValue();
                        self.set(id, val);
                        return;
                    }
                }
            }

            self.store[id] = val;
            if (this.config.localcache) {
                localStorage.setItem(this.name, JSON.stringify(this.store));
                self.char_length = (localStorage.getItem(this.name)).length;
            }
            if (!this._inQueue(id)) this._pushToQueue(id);

        } catch (e) {
            console.log(e);
            self._removeOldestValue();
            self.set(id, val);
        }
    } else {
        this.store[id] = val;
    }
};

DataStore.prototype.get = function(id) {
    if (_.exists(this.store[id])) {
        // rearrange the queue
        var pos = -1;
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i] === id) {
                pos = i;
                break;
            }
        }
        if (pos === -1) return false;
        if (pos !== -1) {
            var tmp = [];
            this.queue = tmp.concat(this.queue.slice(0, pos), this.queue.slice(pos + 1, this.queue.length), this.queue[pos]);
        }
        return this.store[id];

    } else {
        return false;
    }
}

DataStore.prototype.clear = function() {
    this.store = {};
}

/* 
    Name : DataList
    Description : Data structuring for the application
                  Stores recurring lists used by the app
*/

function DataList(name, config) {
    if (_.exists(config)) {
        this.config = config;
    } else {
        this.config = {};
    }
    this.name = name;
    this.list = [];
}

DataList.prototype.push = function(val) {
    this.list.push(val);
}
DataList.prototype.pop = function() {
    return this.list.pop();
}
DataList.prototype.clear = function() {
    this.list = [];
}
DataList.prototype.set = function(list) {
    if (_.exists(list)) {
        this.list = list;
    } else {
        this.list = [];
    }
}
DataList.prototype.get = function() {
    return this.list;
}

/*
    Name: lib 
    Note : I should really come up with a name for this
    Description: Contains structures for routes,views and data stores
*/

var lib = function() {
    this.views = [];
    this.view_instances = [];
    this.Router = {}
}

lib.prototype.defineView = function(name, definition) {
    if (_.exists(this.views[name])) {
        console.log("WARNING: View exists with the same ID. Previously defined view will be overwritten");
    }

    //default definition
    if (!_.exists(definition)) {
        definition = {};
    }

    //default render property
    if (!_.exists(definition.template)) {
        definition.template = function() {
            return "<div></div>"
        };
    }

    //default events property
    if (!_.exists(definition.events)) {
        definition.events = function() {};
    }

    //default config object
    if (!_.exists(definition.config)) {
        definition.config = {};
    }

    definition.name = name;
    definition.element = "";

    this.views[name] = new View(definition);
    return this.views[name];
}

lib.prototype.createElement = function(prop) {
    var name = prop.name;
    var id = prop.id;
    var element = prop.elem;
    var wrap = prop.wrap;

    if (_.exists(this.views[name])) {
        var inst = this.views[name];

        if (_.exists(element)) {
            inst.element = element;
        }
        if (_.exists(name) && name !== '' && name !== null) {
            inst.name = name;
        }
        if (!_.exists(wrap) || wrap === true) {
            inst.wrap = true;
        } else {
            inst.wrap = false;
            this.view_instances[id] = inst;
        }

        if (name !== null && inst.wrap === true) {
            var tmp_id = 'element-' + id + '-' + name;
            inst.DOM_id = tmp_id;
        }
        return inst;

    } else {
        // Throw error if view is not defined
        throw new Error("ERROR: View not defined." + id + name + elem);
        return false;
    }
}

var Library = new lib();