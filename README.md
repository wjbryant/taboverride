# Tab Override

Tab Override is a lightweight script that allows tabs to be entered in
`textarea` elements. A
[jQuery plugin](https://github.com/wjbryant/jquery.taboverride "Tab Override jQuery plugin")
is also available to adapt the API to jQuery. Code documentation is available at
[wjbryant.github.com/taboverride/](http://wjbryant.github.com/taboverride/ "Tab Override Code Documentation").

Try out the demo at
[wjbryant.com/projects/tab-override/](http://wjbryant.com/projects/tab-override/ "Tab Override Demo").

## Features

* Tab insertion via the Tab key
* Tab removal via the Shift+Tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent
* Custom key combinations (use any key and modifier keys for tab/untab)

## Setup

Include either `taboverride.js` or `taboverride.min.js` in the page. These files
can be found in the [build directory](https://github.com/wjbryant/taboverride/tree/master/build).

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

```javascript
// get all the textarea elements on the page
var textareas = document.getElementsByTagName('textarea');

// enable Tab Override for all textareas
TABOVERRIDE.set(textareas);
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

### Get/Set Key Combinations

```javascript
// get the current tab key combination
var tabKeyCombo = TABOVERRIDE.tabKey();

// get the current untab key combination
var untabKeyCombo = TABOVERRIDE.untabKey();
```

The key combinations used for tabbing and untabbing can be customized. If
accessibility is a concern, it is recommended to set key combinations that are
not mapped to any action by default.

Setting the key combinations is done by calling the `tabKey()` or `untabKey()`
methods with parameters. The first parameter is the key code (`Number`) of the
key. The second parameter is optional and specifies modifier keys (`alt`, `ctrl`,
`meta`, `shift`) as an array of strings.

```javascript
// set the tab key combination to ctrl+]
// and the untab key combination to ctrl+[
TABOVERRIDE
    .tabKey(221, ['ctrl'])
    .untabKey(219, ['ctrl']);
```

Different modifier keys can be used for different operating systems by checking
the `navigator.platform` property. The following example uses the Command key on
Mac and the Control key on Windows/Linux.

```javascript
var modKey = /mac/i.test(navigator.platform) ? 'meta' : 'ctrl';
TABOVERRIDE.tabKey(221, modKey).untabKey(219, modKey);
```

The default tab key combination is: `Tab`. The default untab key combination is:
`Shift + Tab`. These combinations can be set like this:

```javascript
// reset the default key combinations
TABOVERRIDE
    .tabKey(9)
    .untabKey(9, ['shift']);
```

### Additional Notes

#### Method Chaining

All methods (unless used as getters) return the `TABOVERRIDE` object, in order
to support method chaining:

```javascript
// set up Tab Override
TABOVERRIDE.tabSize(4).autoIndent(true).set(textarea);
```

#### Custom Event Registration

The event handler functions can also be accessed directly, if you wish to use
a different method of event registration.

There are two event handler functions that need to be registered.
`TABOVERRIDE.overrideKeyDown` should be registered for the `keydown` event and
`TABOVERRIDE.overrideKeyPress` should be registered for the `keypress` event.

For example, to use jQuery event registration instead of the `TABOVERRIDE.set()`
method, you could do the following:

```javascript
$('textarea')
    .on('keydown', TABOVERRIDE.overrideKeyDown)
    .on('keypress', TABOVERRIDE.overrideKeyPress);
```

*Note: The [jQuery plugin](https://github.com/wjbryant/jquery.taboverride)
may already provide the functionality you need.*

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit