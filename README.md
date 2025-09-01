cookie-events
=============

<p align="center">
  <a href="https://github.com/jsvibe">
    <img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vlygveqdaj5k1ow0p20d.png" alt="Cookie Logo" height="440">
  </a>
</p>

Lightweight, event-driven cookie manager for parsing, setting, and tracking cookies with ease.

[![npm version](https://img.shields.io/npm/v/cookie-events?logo=npm)](https://www.npmjs.com/package/cookie-events)
![license](https://img.shields.io/github/license/jsvibe/cookie-events?color=blue)
[![downloads month](https://img.shields.io/npm/dm/cookie-events)](https://www.npmjs.com/package/cookie-events)
[![jsDelivr Hits](https://img.shields.io/jsdelivr/npm/hm/cookie-events?logo=jsdelivr)](https://www.jsdelivr.com/package/npm/cookie-events)
[![author](https://img.shields.io/badge/Author-Modassir-blue)](https://github.com/indianmodassir)
[![Publish Package to npm](https://github.com/jsvibe/cookie-events/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/jsvibe/cookie-events/actions/workflows/npm-publish.yml)


Installation
------------

To include cookie-events in [Node](https://nodejs.org/), first install with npm.

```bash
npm install cookie-events
```

How to build cookie-events
--------------------------

Clone a copy of the main cookie-events git repo by running:

```bash
git clone git://github.com/jsvibe/cookie-events.git
```

Including cookie-events
-----------------------

Below are some of the most common ways to include cookie-events.

### Browser

**CDN Link**

```html
<script src="https://cdn.jsdelivr.net/npm/cookie-events@1.1.0/lib/cookie.min.js"></script>
```

You can add the script manually to your project:

```html
<script src="cookie.js"></script>
```

### ESM

```js
import cookieEvents from 'cookie-events'
const cookie = new cookieEvents;
```

### Webpack / Browserify / Babel

There are several ways to use [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/) or [Babel](https://babeljs.io/). For more information on using these tools, please refer to the corresponding project's documentation. In the script, including cookie-events will usually look like this:

```js
import cookieEvents from 'cookie-events'
const cookie = new cookieEvents;
```

### Methods or Features

This library provides a robust and modern API for managing browser cookies, with support for creation, retrieval, updates, deletion, and real-time event handling.

|Methods|Description|
|:------|:---------------------------------------------------------------------------------|
|[set](#set)|Creates a new cookie with optional attributes (expires, path, domain, etc).   |
|[getAll](#getall)|Returns all cookies as a key-value object.                              |
|[store](#store)|Exposes the internal cookie store object.                                 |
|[param](#param)|Converts cookies into a query-style string (e.g., `name=John&age=30`).    |
|[get](#get)|Retrieves the value of a specific cookie by key.                              |
|[update](#update)|Updates an existing cookie’s value and attributes.                      |
|[json](#json)|Converts all cookies into a JSON string.                                    |
|[UTC](#utc)|Converts a custom date string into a UTC-formatted string.                    |
|[parse](#parse)|Returns cookies as an array of `[key, value]` pairs.                      |
|[has](#has)|Checks if a cookie with the given key exists.                                 |
|[remove](#remove)|Deletes a specific cookie by setting expiry in the past.                |
|[clear](#clear)|Asynchronously clears all cookies using the Cookie Store API.             |
|[on](#on)|Registers event listeners for cookie changes (insert, update, delete, etc).     |

### set

Creates or overwrites a cookie with optional attributes.

**Parameters:**

- `key` *(String)* Name of the cookie.  
- `value` *(Any)* Value to store (objects/arrays auto-serialized as JSON).  
- `expires` *(String | Number)* Expiry date (UTC string) or max-age in seconds.  
- `path` *(String, optional)* Path scope (default: `/`).  
- `domain` *(String, optional)* Domain scope.  
- `secure` *(Boolean, optional)* If true, cookie only sent over HTTPS.  
- `SameSite` *(String, optional)* `"Strict"`, `"Lax"`, or `"None"`.

**Example:**

```js
const Cookie = new Cookie;
Cookie.set("theme", "dark", Cookie.UTC("2025-12-31 23:59:59"));
```

### getAll

Returns all cookies as a key-value object.

**Example:**

```js
const Cookie = new Cookie;
console.log(Cookie.getAll()); // Output: e.g, { theme: "dark", user: { id: 1 } }
```

### store

Exposes the internal cookie store object (for debugging/inspection).

**Example:**

```js
const Cookie = new Cookie;
console.log(Cookie.store);
```

### param

Converts cookies into a query-style string.

**Example:**

```js
const Cookie = new Cookie;
console.log(Cookie.param()); // Output: e.g, "theme=dark&user=%7B%22id%22%3A1%7D"
```

### get

Retrieves the value of a cookie by its name.

**Parameters:**

- `key` *(String)* Cookie name.
- Returns: Value *(Any)* or `null` if not found.

**Example:**

```js
const Cookie = new Cookie;
console.log(Cookie.get("theme")); // "dark"
```

### update

Updates the value of an existing cookie. Throws error if cookie does not exist.

**Parameters:**

- `key` *(String)* Name of the cookie.  
- `value` *(Any)* Value to store (objects/arrays auto-serialized as JSON).  
- `expires` *(String | Number)* Expiry date (UTC string) or max-age in seconds.  
- `path` *(String, optional)* Path scope (default: `/`).  
- `domain` *(String, optional)* Domain scope.  
- `secure` *(Boolean, optional)* If true, cookie only sent over HTTPS.  
- `SameSite` *(String, optional)* `"Strict"`, `"Lax"`, or `"None"`.

**Example:**

```js
const Cookie = new Cookie;
Cookie.update("theme", "light", Cookie.UTC("2026-01-01 00:00:00"));
```

### json

Converts all cookies into a JSON string.

**Example:**

```js
console.log(Cookie.json()); // Output: e.g, {"theme":"dark","user":{"id":1}}
```

### UTC

Converts a date string into UTC format (for `expires` attribute).

**Parameters:**

- `date` *(String)* Example: `"2025-12-31 23:59:59"`
- Returns: `String` UTC date string.

**Example:**

```js
const Cookie = new Cookie;
let exp = Cookie.UTC("2025-12-31 23:59:59");
Cookie.set("session", "active", exp);
```

### parse

Parses cookies into an array of `[key, value]` pairs.
- Returns: `Array` Example: `[["theme","dark"], ["user",{id:1}]]`

**Example:**

```js
const Cookie = new Cookie;
console.log(Cookie.parse());
```

### has

Checks if a cookie exists.

- Returns: `boolean` Return true if exists. Otherwise false

**Example:**

```js
const Cookie = new Cookie;
if (Cookie.has("theme")) {
  console.log("Theme cookie exists!");
}
```

### remove

Deletes a specific cookie by setting its expiry to the past.

**Parameters:**

- `key` *(String)* The name of the cookie to remove.
- `path` *(String)* The path the cookie was set on. Default is "/".
- `domain` *(String)* The domain the cookie was set on.

**Example:**

```js
const Cookie = new Cookie;
Cookie.remove("theme");
```

### clear

Asynchronously removes all cookies using the Cookie Store API.

⚠️ Works only in secure contexts (HTTPS) and supported browsers.

**Example:**

```js
const Cookie = new Cookie;
await Cookie.clear();
```

### on

Registers event listeners for cookie changes.

**Parameters:**

- `types` *(String)* Space-separated events (`insert`, `update`, `delete`, `clear`, `change`).
- `callback` *(Function)* Called when event occurs.

```js
const Cookie = new Cookie;
Cookie.on("insert update delete", (e) => {
  console.log("Cookie event:", e.type, e.changed, e.deleted);
});
```

### Supported Events

- `insert` → A new cookie was added.
- `update` → An existing cookie was updated.
- `delete` → A cookie was removed.
- `clear` → All cookies were cleared.
- `change` → Fired on any cookie change.

License
-------

MIT License © 2025 [Indian Modassir](https://github.com/indianmodassir)  
See [LICENSE](LICENSE) for details.


Contributions
-------------

Pull requests, bug reports, and feedback are welcome!  
Visit the [GitHub Repository](https://github.com/jsvibe/cookie-events) to contribute.