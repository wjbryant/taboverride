# Tab Override

Tab Override is a lightweight jQuery plugin that allows tabs to be entered in textarea elements.

See a live example at
[wjbryant.com/projects/tab-override/](http://wjbryant.com/projects/tab-override/ "Tab Override Demo").

Documentation is available at [wjbryant.com/projects/tab-override/docs/](http://wjbryant.com/projects/tab-override/docs/symbols/jQuery.fn.tabOverride.html "Tab Override Documentation").

## Features

* Tab insertion via the tab key
* Tab removal via the shift+tab key combination
* Multi-line selection support
* Adjustable tab size
* Auto indent

## Usage

### Enable Tab Override

```javascript
// no arguments
$('textarea').tabOverride();

// or any truthy argument
$('textarea').tabOverride(true);
```

### Disable Tab Override

```javascript
// any falsy argument
$('textarea').tabOverride(false);
```

### Get/Set Tab Size

```javascript
// get the current tab size (0 represents the tab character)
$.fn.tabOverride.tabSize();

// set the tab size to the tab character (default)
$.fn.tabOverride.tabSize(0);

// set the tab size to 4 spaces
$.fn.tabOverride.tabSize(4);
```

### Enable/Disable Auto Indent

```javascript
// enable auto indent
$.fn.tabOverride.autoIndent = true;

// disable auto indent (default)
$.fn.tabOverride.autoIndent = false;
```

## Browser Support

IE 6+, Firefox, Chrome, Safari, Opera 10.50+

## License

MIT license - http://opensource.org/licenses/mit