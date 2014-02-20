# Tab Override

Tab Override is a lightweight script that allows tabs to be entered in
`textarea` elements. A
[jQuery plugin](https://github.com/wjbryant/jquery.taboverride "Tab Override jQuery plugin")
is also available which wraps the API for jQuery. Code documentation is available at
[wjbryant.github.io/taboverride/docs/](http://wjbryant.github.io/taboverride/docs/tabOverride.html "Tab Override Code Documentation").

Try out the demo at
[wjbryant.github.io/taboverride/](http://wjbryant.github.io/taboverride/ "Tab Override Demo").

## Features

* Tab insertion via the Tab key
* Tab removal via the Shift+Tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent
* Custom key combinations (use any key and modifier keys for tab/untab)
* Extension system using hooks

## Setup

Download the latest release from the [releases page](https://github.com/wjbryant/taboverride/releases).
Load either `taboverride.js` or `taboverride.min.js` in your project. These files
can be found in the `build/output` directory.

This project is also hosted on the jsDelivr CDN. See http://www.jsdelivr.com/#!taboverride
for more information.

### Library Wrappers

If you are using jQuery, you can also include the
[Tab Override jQuery plugin](https://github.com/wjbryant/jquery.taboverride)
in your project to gain access to the Tab Override API through jQuery. See the
[jQuery plugin repository](https://github.com/wjbryant/jquery.taboverride)
for more details.

### Extensions

* [Delay](https://github.com/wjbryant/taboverride.delay) - Waits some time after focus before enabling Tab Override
* [Escape](https://github.com/wjbryant/taboverride.escape) - Makes the Escape key temporarily disable Tab Override
* [Style](https://github.com/wjbryant/taboverride.style) - Adds a CSS class to elements with Tab Override enabled

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

#### Optimization

When combining this script with other JavaScript files, it is recommended to
first process it with the [r.js](https://github.com/jrburke/r.js) tool like so:

```
r.js -o name=taboverride out=taboverride.named.min.js
```

*Note: On Windows, you may have to use `r.js.cmd` instead.*

Then combine the resulting `taboverride.named.min.js` file with the other
JavaScript files. This will give the module a name so that calls to `require()`
continue to function properly.

### CommonJS

This script is also compatible with [CommonJS module](http://wiki.commonjs.org/wiki/Modules)
systems.

### WordPress Plugin

The Tab Override WordPress plugin is available at http://wordpress.org/plugins/tab-override/.

### MediaWiki Extension

A MediaWiki extension is also available at http://www.mediawiki.org/wiki/Extension:Tab_Override.

*Note: This extension is no longer maintained.*

## Usage

Unless using a module loader, this script creates a single global variable
named `tabOverride`. The API consists of methods attached to this object.

### Enable/Disable Tab Override

Enable Tab Override using the `set()` method of the `tabOverride` object. It
accepts an element or an array (or array-like object) of elements.

```html
<textarea id="txt"></textarea>
```

```javascript
// get a reference to the textarea element
var textarea = document.getElementById('txt');

// enable Tab Override for the textarea
tabOverride.set(textarea);
```

```javascript
// get all the textarea elements on the page
var textareas = document.getElementsByTagName('textarea');

// enable Tab Override for all textareas
tabOverride.set(textareas);
```

The `set()` method also accepts an optional second parameter. If this parameter
is any truthy value, Tab Override will be enabled. A falsy value will disable
Tab Override for the specified element(s). The default value is `true`.

To disable Tab Override for the `textarea`, pass a falsy value as the second
argument to `tabOverride.set()`:

```javascript
// disable Tab Override for the textarea
tabOverride.set(textarea, false);
```

### Get/Set Tab Size

```javascript
// get the current tab size (0 represents the tab character)
var tabSize = tabOverride.tabSize();
```

```javascript
// set the tab size to the tab character (default)
tabOverride.tabSize(0);

// set the tab size to 4 spaces
tabOverride.tabSize(4);
```

### Get/Set Auto Indent

```javascript
// get the current auto indent setting
var autoIndentEnabled = tabOverride.autoIndent();
```

```javascript
// enable auto indent (default)
tabOverride.autoIndent(true);

// disable auto indent
tabOverride.autoIndent(false);
```

### Get/Set Key Combinations

```javascript
// get the current tab key combination
var tabKeyCombo = tabOverride.tabKey();

// get the current untab key combination
var untabKeyCombo = tabOverride.untabKey();
```

The key combinations used for tabbing and untabbing can be customized. If
accessibility is a concern, it is recommended to set key combinations that are
not mapped to any action by default.

Setting the key combinations is done by calling the `tabKey()` or `untabKey()`
method with arguments. The first parameter is the key code (`number`) of the
key. The second parameter is optional and specifies modifier keys (`alt`, `ctrl`,
`meta`, `shift`) as an array of strings.

```javascript
// set the tab key combination to ctrl+]
// and the untab key combination to ctrl+[
tabOverride
    .tabKey(221, ['ctrl'])
    .untabKey(219, ['ctrl']);
```

Different modifier keys can be used for different operating systems by checking
the `navigator.platform` property. The following example uses the Command key on
Mac and the Control key on Windows/Linux.

```javascript
var modKeys = [/mac/i.test(navigator.platform) ? 'meta' : 'ctrl'];
tabOverride.tabKey(221, modKeys).untabKey(219, modKeys);
```

The default tab key combination is: `Tab`. The default untab key combination is:
`Shift + Tab`. These combinations can be set like this:

```javascript
// reset the default key combinations
tabOverride
    .tabKey(9)
    .untabKey(9, ['shift']);
```

### Add an Extension

Tab Override can be extended by "hooking into" different parts of the code.
To add an extension function, call the `addExtension` method with the name of
the hook for which to register and the function to be executed when the hook
"fires."

Example:

```javascript
tabOverride.addExtension('set', function (elem, enable) {
    console.log('tabOverride was ' + (enable ? 'enabled' : 'disabled') + ' on: ', elem);
});
```

### Hooks

These are the default available hooks. Library wrappers and extensions may add
additional hooks.

**set** - Called when the `set` method is invoked

*Parameters:*
* `elem` - the element for which Tab Override was enabled or disabled
* `enable` - whether Tab Override was enabled or disabled

**addListeners** - Called when the `utils.addListeners` method is invoked

*Parameters:*
* `elem` - the element on which the listeners were added

**removeListeners** - Called when the `utils.removeListeners` method is invoked

*Parameters:*
* `elem` - the element from which the listeners were removed

### Utility Methods

Utility methods are provided under `tabOverride.utils`:

* `executeExtensions`
* `isValidModifierKeyCombo`
* `createListeners`
* `addListeners`
* `removeListeners`

Documentation on these methods can be found in the
[code documentation](http://wjbryant.github.io/taboverride/docs/tabOverride.utils.html).

### Additional Notes

#### Method Chaining

When used as setters, all methods of `tabOverride` return the `tabOverride`
object, in order to support method chaining:

```javascript
// set up Tab Override
tabOverride.tabSize(4).autoIndent(true).set(textarea);
```

Utility methods under the `tabOverride.utils` namespace are not chainable.

#### Custom Event Registration

The event handler functions can also be accessed directly, if you wish to use
a different method of event registration.

There are two event handler functions that need to be registered.
`tabOverride.handlers.keydown` should be registered for the `keydown` event and
`tabOverride.handlers.keypress` should be registered for the `keypress` event.

For example, to use jQuery event registration instead of the `tabOverride.set()`
method, you could do the following:

```javascript
$('textarea')
    .on('keydown', tabOverride.handlers.keydown)
    .on('keypress', tabOverride.handlers.keypress);
```

*Note: The [jQuery plugin](https://github.com/wjbryant/jquery.taboverride)
may already provide the functionality you need.*

## Building the Project

This project uses [Grunt](https://github.com/gruntjs/grunt) to manage the build
process. Most dependencies needed to build the project can be installed via
[npm](https://npmjs.org/). Documentation generation requires [Java](http://java.com/).
Run `npm install` from the root directory of the project to install the
dependencies. Run `grunt` to start the build.

It is also possible to build the project for loading in a specific environment
using the Grunt targets `amd`, `cjs`, or `globals`. These targets will not run
unit tests. `umd` is used if no target is specified.

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit