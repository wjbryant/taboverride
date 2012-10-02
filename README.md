# Tab Override

Tab Override is a lightweight script that allows tabs to be entered in
`textarea` elements. It is also available as a
[jQuery plugin](https://github.com/wjbryant/jquery.taboverride "Tab Override jQuery plugin").
Code documentation is available at
[wjbryant.github.com/taboverride/](http://wjbryant.github.com/taboverride/ "Tab Override Documentation").

Try out the Tab Override demo at
[wjbryant.com/projects/tab-override/](http://wjbryant.com/projects/tab-override/ "Tab Override Demo").

## Features

* Tab insertion via the tab key
* Tab removal via the shift+tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent

## Setup

Include either `taboverride-x.x.x.js` or `taboverride-x.x.x.min.js` in the page.
See the [Downloads page](downloads) or the [build directory](tree/master/build).

### Bower

This script is registered as `taboverride` in the global [Bower](http://twitter.github.com/bower/)
registry. Install Bower via NPM and then run this command from the root directory
of your project to install Tab Override:

```
bower install taboverride
```

This will download Tab Override into a `components` directory in your project.

### AMD

This script is AMD compatible and can be loaded using a script loader such as
[RequireJS](http://requirejs.org/). It is defined as a module named `taboverride`.

## Usage

This script creates a single global variable named `TABOVERRIDE`. The API
consists of methods attached to this object.

### Enable/Disable Tab Override

The `TABOVERRIDE` global object exposes two functions, `overrideKeyDown` and
`overrideKeyPress`, that need to be registered on the `textarea` element for the
`keydown` and `keypress` events respectively.

Here is an example using the DOM Level 0 API:

```html
<textarea id="txt"></textarea>
```

```javascript
// get a reference to the textarea element
var textarea = document.getElementById('txt');

// register event handlers
textarea.onkeydown = TABOVERRIDE.overrideKeyDown;
textarea.onkeypress = TABOVERRIDE.overrideKeyPress;
```

To disable Tab Override for the `textarea`, you would simply remove the event
handlers:

```javascript
textarea.onkeydown = null;
textarea.onkeypress = null;
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

### Enable/Disable Auto Indent

```javascript
// enable auto indent
TABOVERRIDE.autoIndent(true);
```

```javascript
// disable auto indent (default)
TABOVERRIDE.autoIndent(false);
```

### Additional Notes

Calls to the settings methods can be chained together:

```javascript
// set up Tab Override
TABOVERRIDE.tabSize(4).autoIndent(true);
```

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit