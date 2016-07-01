module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = immutableStateInvariantMiddleware;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _invariant = __webpack_require__(1);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _jsonStringifySafe = __webpack_require__(3);

	var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

	var _isImmutable = __webpack_require__(4);

	var _isImmutable2 = _interopRequireDefault(_isImmutable);

	var _trackForMutations = __webpack_require__(5);

	var _trackForMutations2 = _interopRequireDefault(_trackForMutations);

	var BETWEEN_DISPATCHES_MESSAGE = ['A state mutation was detected between dispatches, in the path `%s`.', 'This may cause incorrect behavior.', '(http://redux.js.org/docs/Troubleshooting.html#never-mutate-reducer-arguments)'].join(' ');

	var INSIDE_DISPATCH_MESSAGE = ['A state mutation was detected inside a dispatch, in the path: `%s`.', 'Take a look at the reducer(s) handling the action %s.', '(http://redux.js.org/docs/Troubleshooting.html#never-mutate-reducer-arguments)'].join(' ');

	function immutableStateInvariantMiddleware() {
	  var isImmutable = arguments.length <= 0 || arguments[0] === undefined ? _isImmutable2['default'] : arguments[0];

	  var track = _trackForMutations2['default'].bind(null, isImmutable);

	  return function (_ref) {
	    var getState = _ref.getState;

	    var state = getState();
	    var tracker = track(state);

	    var result = undefined;
	    return function (next) {
	      return function (action) {
	        state = getState();

	        result = tracker.detectMutations();
	        // Track before potentially not meeting the invariant
	        tracker = track(state);

	        (0, _invariant2['default'])(!result.wasMutated, BETWEEN_DISPATCHES_MESSAGE, (result.path || []).join('.'));

	        var dispatchedAction = next(action);
	        state = getState();

	        result = tracker.detectMutations();
	        // Track before potentially not meeting the invariant
	        tracker = track(state);

	        (0, _invariant2['default'])(!result.wasMutated, INSIDE_DISPATCH_MESSAGE, (result.path || []).join('.'), (0, _jsonStringifySafe2['default'])(action));

	        return dispatchedAction;
	      };
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	exports = module.exports = stringify
	exports.getSerialize = serializer

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [], keys = []

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
	    if (stack[0] === value) return "[Circular ~]"
	    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  }

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = stack.indexOf(this)
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
	      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
	    }
	    else stack.push(value)

	    return replacer == null ? value : replacer.call(this, key, value)
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = isImmutableDefault;

	function isImmutableDefault(value) {
	  return typeof value !== 'object' || value === null || typeof value === 'undefined';
	}

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = trackForMutations;

	function trackForMutations(isImmutable, obj) {
	  var trackedProperties = trackProperties(isImmutable, obj);
	  return {
	    detectMutations: function detectMutations() {
	      return _detectMutations(isImmutable, trackedProperties, obj);
	    }
	  };
	}

	function trackProperties(isImmutable, obj) {
	  var tracked = { value: obj };

	  if (!isImmutable(obj)) {
	    tracked.children = {};

	    for (var key in obj) {
	      tracked.children[key] = trackProperties(isImmutable, obj[key]);
	    }
	  }
	  return tracked;
	}

	function _detectMutations(isImmutable, trackedProperty, obj) {
	  var sameParentRef = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	  var path = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

	  var prevObj = trackedProperty ? trackedProperty.value : undefined;

	  var sameRef = prevObj === obj;

	  if (sameParentRef && !sameRef) {
	    return { wasMutated: true, path: path };
	  }

	  if (isImmutable(prevObj) || isImmutable(obj)) {
	    return { wasMutated: false };
	  }

	  // Gather all keys from prev (tracked) and after objs
	  var keysToDetect = {};
	  Object.keys(trackedProperty.children).forEach(function (key) {
	    keysToDetect[key] = true;
	  });
	  Object.keys(obj).forEach(function (key) {
	    keysToDetect[key] = true;
	  });

	  var keys = Object.keys(keysToDetect);
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var result = _detectMutations(isImmutable, trackedProperty.children[key], obj[key], sameRef, path.concat(key));

	    if (result.wasMutated) {
	      return result;
	    }
	  }
	  return { wasMutated: false };
	}
	module.exports = exports["default"];

/***/ }
/******/ ]);