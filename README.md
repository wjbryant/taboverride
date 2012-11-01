# Tab Override

Tab Override is a lightweight script that allows tabs to be entered in
`textarea` elements. A
[jQuery plugin](https://github.com/wjbryant/jquery.taboverride "Tab Override jQuery plugin")
is also available to adapt the API to jQuery. Code documentation is available at
[wjbryant.github.com/taboverride/](http://wjbryant.github.com/taboverride/ "Tab Override Code Documentation").

Try out the demo at
[wjbryant.com/projects/tab-override/](http://wjbryant.com/projects/tab-override/ "Tab Override Demo").

## Features

* Tab insertion via the tab key
* Tab removal via the shift+tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent

## Setup

Include either `taboverride-x.x.x.js` or `taboverride-x.x.x.min.js` in the page.
See the [Downloads page](https://github.com/wjbryant/taboverride/downloads) or
the [build directory](https://github.com/wjbryant/taboverride/tree/master/build)
for the appropriate files.

### Library Adapters

If you are using jQuery, you can also include the
[Tab Override jQuery plugin](https://github.com/wjbryant/jquery.taboverride)
in your project to gain access to the Tab Override API through jQuery. See the
[jQuery plugin repository](https://github.com/wjbryant/jquery.taboverride)
for more details.

### Bower

This script is registered as `taboverride` in the global [Bower](http://twitter.github.com/bower/)
registry. Install Bower via [npm](https://npmjs.org/doc/README.html) and then
run this command from the root directory of your project to install Tab Override:

```
bower install taboverride
```

This will download Tab Override into a `components` directory in your project.

### AMD

This script is [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible and
can be loaded using a script loader such as [RequireJS](http://requirejs.org/).
It is defined as a module named `taboverride`.

## Usage

This script creates a single global variable named `TABOVERRIDE`. The API
consists of methods attached to this object.

### Enable/Disable Tab Override

Enable Tab Override using the `set()` method of the `TABOVERRIDE` object. It
accepts an element or an array (or array-like object) of elements.

```html
<textarea id="txt"></textarea>
```

```javascript
// get a reference to the textarea element
var textarea = document.getElementById('txt');

// enable Tab Override for the textarea
TABOVERRIDE.set(textarea);
```

The `set()` method also accepts an optional second parameter. If this
parameter is any truthy value, Tab Override will be enabled, otherwise it will
be disabled for the specified element(s). The default value is `true`.

To disable Tab Override for the `textarea`, pass a falsy value as the second
parameter to `TABOVERRIDE.set()`:

```javascript
// disable Tab Override for the textarea
TABOVERRIDE.set(textarea, false);
```

### Get/Set Tab Size

```javascript
// get the current tab size (0 represents the tab character)
var tabSize = TABOVERRIDE.tabSize();
```

```javascript
// set the tab size to the tab character (default)
TABOVERRIDE.tabSize(0);

// set the tab size to 4 spaces
TABOVERRIDE.tabSize(4);
```

### Get/Set Auto Indent

```javascript
// get the current auto indent setting
var autoIndentEnabled = TABOVERRIDE.autoIndent();
```

```javascript
// enable auto indent
TABOVERRIDE.autoIndent(true);

// disable auto indent (default)
TABOVERRIDE.autoIndent(false);
```

### Additional Notes

All methods (unless used as getters) return the `TABOVERRIDE` object, in order
to support method chaining:

```javascript
// set up Tab Override
TABOVERRIDE.tabSize(4).autoIndent(true).set(textarea);
```

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit