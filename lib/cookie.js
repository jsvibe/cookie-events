/**
 * Cookie JavaScript Library v1.0.0
 * A lightweight utility to parse, retrieve, and set browser cookies using JavaScript.
 * https://github.com/jsvibe/cookie-events
 * 
 * @license MIT License
 * @author Indian Modassir
 * 
 * Date: 29 May 2025 05:55 GMT+0530
 */
(function(window) {

// Catches errors and disallows unsafe actions
"use strict";

var hasOwn = ({}).hasOwnProperty;
var document = window.document;

// Used for storing event handlers
var memory = {};

// Initialize cookie object to access existing cookies
var cookies = new Cookie();

/**
 * Cookie constructor function to create a cookie object that parses the current document's cookies
 * into a JavaScript object.
 * 
 * This function can be called with or without the `new` keyword.
 * If called without `new`, it automatically returns a new instance of Cookie.
 */
function Cookie() {

  // Allow instantiation without the 'new' keyword
  if (!(this instanceof Cookie)) {
    return new Cookie();
  }

  var cookie, key, value,
    cookies = document.cookie.split("; "),
    cookieStore = {};

    // Define a method on the prototype to retrieve all stored cookies
    Cookie.prototype.getAll = function() {
      return cookieStore;
    };

  // If the first item in the cookies array is an empty string,
  if (cookies[0] === "") return;

  // Loop through each individual cookie string
  for(cookie of cookies) {

    // Split the cookie into key and value using "=" as the delimiter
    cookie = cookie.split("=");

    key = decodeURIComponent(cookie.shift());
    value = decodeURIComponent(cookie.join("="));

    // Try to parse the value as JSON
    try {value = JSON.parse(value)} catch(e) {}

    // Store the parsed key-value pair in the cookieStore object
    cookieStore[key] = value;
  }

  // Copy all key-value pairs from cookieStore to the current instance
  Object.assign(this, cookieStore);
  return this;
}

// Define methods on Cookie's prototype
Cookie.prototype = {

  // Expose the internal cookie store (optional)
  store: cookieStore,

  /**
   * Converts cookies to a URL query-style string
   * Useful for debugging or building query parameters
   * Example: "name=John; age=30" => "name=John&age=30"
   */
  param: function() {
    return document.cookie.replace(/;\s/g, "&");
  },

  /**
   * Sets a new cookie in the browser with optional attributes for customization and security.
   * 
   * This method allows the storage of structured data (objects, arrays, primitives)
   * by JSON-stringifying and URI-encoding the value.
   * Additional cookie attributes like `expires`, `path`, `domain`, `secure`, and `SameSite`
   * help control cookie scope and behavior.
   * 
   * @param {String}        key      The name of the cookie.
   * @param {*}             value    The value to be stored
   * @param {String|Number} expires  Expiry date in Custom or UTC format
   * @param {String}        path     Path where the cookie is accessible (default is root).
   * @param {String}        domain   Domain where the cookie is valid.
   * @param {Boolean}       secure   If true, cookie will be sent over HTTPS only.
   * @param {String}        SameSite Controls cross-site request behavior
   */
  set: function(key, value, expires, path, domain, secure, SameSite) {
    var entries, group,
      expkey = +expires ? "max-age" : "expires",
      cookie = [],
      params = {
        [key]: encodeURIComponent(value), // Safely encode the value
        [expkey]: expires,                // Expiration date
        path: path || "/",                // Path defaults to root
        domain,                           // Domain scope
        secure,                           // Secure flag
        SameSite                          // SameSite policy
      };

    // Convert the object into an array of key-value pairs
    entries = Object.entries(params);

    // Iterate over the key-value pairs to build the cookie string
    for(group of entries) {
      if (group[1] != null) {
        cookie.push(group.join("=")); // Only include non-null values
      }
    }

    // Join parts with '; ' and assign or set to document.cookie
    document.cookie = cookie.join("; ");
  },

  /**
   * Convert current cookie object to a JSON string Useful for debugging or storage
   * @returns Cookies in json format
   */
  json: function() {
    return JSON.stringify(new Cookie);
  },

  /**
   * Parses all available cookies into an array of [key, value] pairs.
   * 
   * @returns {Array[]} An array of [key, value] pairs representing cookies.
   */
  parse: function() {
    return Object.entries(this.getAll());
  },

  /**
   * Checks whether a cookie with the specified key exists in the current instance.
   * 
   * This method verifies if the given cookie key is present in the internal
   * cookie storage. It's a safe way to determine existence without directly accessing properties.
   * 
   * It uses `Object.prototype.hasOwnProperty` to avoid false positives 
   * from inherited properties or prototype pollution.
   * 
   * @param {String} key The name of the cookie to check.
   * @returns {Boolean} Returns `true` if the cookie exists, otherwise `false`.
   */
  has: function(key) {
    return hasOwn.call(this.getAll(), key);
  },

  /**
   * Retrieves the value of a specific cookie by its key.
   * The value returned is already decoded and, if applicable, parsed from JSON.
   * 
   * If the specified key exists, the associated value is returned.
   * If not found, the method returns `null` instead of `undefined` 
   * to clearly indicate the absence of the cookie.
   * 
   * @param {String} key The name of the cookie to retrieve.
   * @returns The cookie value, or null if it doesn't exist
   */
  get: function(key) {
    var cookies = this.getAll();
    return hasOwn.call(cookies, key) ? cookies[key] : null;
  },

  /**
   * Updates the value of an existing cookie.
   * 
   * @param {String}        key      The name of the cookie.
   * @param {*}             value    The value to be stored
   * @param {String|Number} expires  Expiry date in Custom or UTC format
   * @param {String}        path     Path where the cookie is accessible (default is root).
   * @param {String}        domain   Domain where the cookie is valid.
   * @param {Boolean}       secure   If true, cookie will be sent over HTTPS only.
   * @param {String}        SameSite Controls cross-site request behavior
   */
  update: function(key, value, expires, path, domain, secure, SameSite) {
    if (!this.has(key)) {
      throw new Error('Cookie [' + key + '] not found. Update failed!');
    }
    this.set(key, value, expires, path, domain, secure, SameSite);
  },

  /**
   * Converts a date string with optional time to a UTC-formatted string.
   * @param {String} date A string representing the date and/or time.
   * @returns {String} The corresponding UTC date string in standard format
   */
  UTC: function(date) {
    var name, value, expires, _arguments,

      /*
       * Regular expression to parse the date and time components from the input string.
       * It captures:
       * day, month, and year (optional)
       * hour, minute, and second (required)
       */
      rdateTime = /(?:(?:(?<day>\d+)([\/-])(?<month>\d+)\2(?<year>\d+)\s)?(?:(?<hour>\d+):(?<minute>\d+):(?<second>\d+)))/,

      // Extract named capture groups (if any) from the input string using the regex
      groups = ((rdateTime.exec(date) || {}).groups || {}),

      // Create a base Date object using the current date and time
      date = new Date,

      // Create a dateTime object initialized with current local date and time
      // Note: month is zero-based in JavaScript Date (0 = January, 11 = December)
      dateTime = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };

    // Override the default dateTime values with parsed values from the input, if available
    for(name in groups) {
      value = groups[name];
      if (value != null) {
        dateTime[name] = +value;
      }
    }

    // Convert the dateTime object to an array of arguments in the correct order for Date.UTC
    // Order: year, month (0-based), day, hour, minute, second
    _arguments = Object.values(dateTime);

    // Create a UTC date using Date.UTC and convert it to a UTC string
    expires = new Date(Date.UTC.apply(null, _arguments)).toUTCString();

    // Return the formatted UTC string
    return expires;
  },

  /**
   * Removes a cookie by setting its expiry date to the past.
   * @param {String} key    The name of the cookie to remove.
   * @param {String} path   The path the cookie was set on. Default is "/".
   * @param {String} domain The domain the cookie was set on.
   */
  remove: function(key, path, domain) {

    // Construct the base cookie deletion string with key and expired date
    var expr = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + (path || "/") + ";";

    // If a domain is provided, append it to the cookie deletion string
    if (domain) {
      expr += " domain=" + domain + ";";
    }

    // Set the cookie with expired date to delete it
    document.cookie = expr;
  },

  /**
   * Asynchronously clears (removes) all cookies available using the Cookie Store API.
   * 
   * Note:
   * - This function is asynchronous and should be awaited when called.
   * - The `cookieStore` API is modern and works in secure contexts (HTTPS) and supported browsers.
   */
  clear: async function() {
    var cookie, cookies = await cookieStore.getAll();

    // Loop through each cookie object
    for(cookie of cookies) {
      this.remove(cookie.name, cookie.path, cookie.domain);
    }
  }
};

/**
 * @internal
 * Utility function to trigger events and call associated callbacks
 * @param {Object} event The original event object
 * @param {String} type  Type of cookie event
 */
function fireWith(event, type) {
  var fn, handlers = memory[type],
    newEvent = {
      changed: event.changed,
      currentTarget: event.currentTarget,
      deleted: event.deleted,
      srcElement: event.srcElement,
      CookieStore: event.CookieStore,
      origEvent: event,
      timeStamp: event.timeStamp,
      type
    };

  // If handlers exist for this event type, invoke them
  if (handlers) {
    for(fn of handlers) {
      fn.call(this, newEvent, type);
    }
  }
}

/**
 * Register event listeners for cookie changes
 * @param {String} types      Space-separated list of event types
 * @param {Function} callback Callback function to invoke on events
 */
Cookie.prototype.on = function(types, callback) {
  var type;
  types = types.split(" ");

  for(type of types) {
    memory[type] = memory[type] || [], memory[type].push(callback);
  }

  // Allows method chaining
  return this;
};

/**
 * onchange handler for cookieStore
 * Detects changes and fires corresponding cookie events
 */
cookieStore.onchange = function(e) {
  var curCookieLen = Object.values(new Cookie()).length,
    changed = e.changed,
    {name, value} = changed[0] || {};
  
  // If cookie already exists and value changed => update
  if (hasOwn.call(cookies, name) && (cookies[name] + "") !== value) {
    fireWith.call(this, e, "update");
  }
  // If new cookie added => insert
  else if (!hasOwn.call(cookies, name) && changed.length) {
    fireWith.call(this, e, "insert");
  }
  // If cookies were deleted or no changes => delete or clear
  else if (e.deleted.length || !changed.length) {
    !curCookieLen ? fireWith.call(this, e, "clear") : fireWith.call(this, e, "delete");
  }
  
  // Always fire a generic change event
  fireWith(this, e, "change");
  cookies = new Cookie();
  return this;
};

// Set the Symbol.toStringTag to "Cookie" for better introspection
Object.defineProperty(
  Cookie.prototype, Symbol.toStringTag, {value: Cookie.name}
);

/* EXPOSE */

// Register as named AMD module,
// since Cookie can be concatenated with other files that may use define
typeof define === 'function' && define.amd ?
  define(function() {
    return Cookie;
  // Expose Cookie identifiers, Even in AMD and CommonJS for browser emulators
  }) : (typeof module === "object" ? module.exports = Cookie : window.Cookie = Cookie);


/* EXPOSE */
})(window);