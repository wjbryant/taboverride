# Tab Override

Tab Override is a lightweight script that allows tabs to be entered in
`textarea` elements. It is available as both a jQuery plugin and a standalone
script.

See a live demo at
[wjbryant.com/projects/tab-override/](http://wjbryant.com/projects/tab-override/ "Tab Override Demo").

Documentation is available at
[wjbryant.github.com/tab-override/](http://wjbryant.github.com/tab-override/ "Tab Override Documentation").

## Features

* Tab insertion via the tab key
* Tab removal via the shift+tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent

## jQuery Plugin

### Setup

The Tab Override jQuery plugin requires jQuery version 1.7 or newer. You can
include either the production version (`jquery.taboverride-x.x.min.js`) or the
development version (`jquery.taboverride-x.x.js`) of the plugin in the page.

### Usage

#### Enable Tab Override

```javascript
// no arguments
$('textarea').tabOverride();

// or any truthy argument
$('textarea').tabOverride(true);
```

#### Disable Tab Override

```javascript
// any falsy argument
$('textarea').tabOverride(false);
```

#### Get/Set Tab Size

```javascript
// get the current tab size (0 represents the tab character)
$.fn.tabOverride.tabSize();

// set the tab size to the tab character (default)
$.fn.tabOverride.tabSize(0);

// set the tab size to 4 spaces
$.fn.tabOverride.tabSize(4);
```

#### Enable/Disable Auto Indent

```javascript
// enable auto indent
$.fn.tabOverride.autoIndent(true);

// disable auto indent (default)
$.fn.tabOverride.autoIndent(false);
```

#### Additional Notes

Calls to the settings functions can be chained together.

```javascript
// set up Tab Override
$.fn.tabOverride.tabSize(4).autoIndent(true);
```

## Using Tab Override Without jQuery

You can still use Tab Override even if you are not using jQuery. The only
difference is that event handler registration will not be done automatically.

### Setup

First, you must include the standalone version of Tab Override in the page
(`taboverride-x.x.js` or `taboverride-x.x.min.js`). This will create a global object
named `TABOVERRIDE`.

### Usage

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

// set up Tab Override
TABOVERRIDE.tabSize(4).autoIndent(true);

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

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit