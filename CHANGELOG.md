# Tab Override Changelog

## 4.0.2 (2014-01-21)
* Fixed source map link for IE
* Updated copyright date

## 4.0.1 (2014-01-21)
* Invalid arguments to `tabSize()` now set tab size to 0

## 4.0.0 (2013-08-27)
* Changed namespace from `TABOVERRIDE` to `tabOverride`
* Moved `overrideKeyDown()` to `tabOverride.handlers.keydown()`
* Moved `overrideKeyPress()` to `tabOverride.handlers.keypress()`
* Auto indent is now enabled by default
* Added `utils` namespace with methods: `executeExtensions()`, `isValidModifierKeyCombo()`, `createListeners()`, `addListeners()`, and `removeListeners()`
* Added basic extension system with hooks - use `tabOverride.addExtension()` to register an extension function
* Added new build targets: `amd`, `cjs`, `globals`, and `umd` (default)

## 3.2.2 (2013-03-12)
* Added CommonJS module support
* The global variable is no longer created when using a module loader
* Updated build process
  * Use JSHint for all js files
  * Run unit tests
  * Generate source map
  * Generate API documentation with JSDoc 3

## 3.2.1 (2013-01-17)
* For multi-line selections, a line with no selected text is no longer indented
* Register as an anonymous AMD module instead of a named one
* Added basic unit tests

## 3.2.0 (2012-12-12)
* Added `tabKey()` and `untabKey()` methods to allow for custom key combinations

## 3.1.0 (2012-11-12)
* Re-exposed `overrideKeyDown()` and `overrideKeyPress()` event handlers

## 3.0.2 (2012-11-01)
* IE 10 compatibility (use standard selection methods)

## 3.0.1 (2012-10-23)
* Fixed event registration bug for IE 6-8

## 3.0.0 (2012-10-12)
* Removed `overrideKeyDown()` and `overrideKeyPress()`
* Added `set()` method

## 2.1.0 (2012-10-02)
* Added AMD support
* Added component.json for Bower support (registered as `taboverride`)
* Separated core and jQuery plugin into individual projects

## 2.0.0 (2012-09-14)
* Separated the Tab Override core and jQuery plugin code - 
  this allows easier integration with other JS libraries
* Exposed core functionality through the `TABOVERRIDE` global object
* Changed `autoIndent` to a `function` -
  ex: `TABOVERRIDE.autoIndent(true);`
* `autoIndent()` and `tabSize()` now return `TABOVERRIDE` when used as setters
* Removed `getTabSize()` and `setTabSize()` - use `tabSize()` instead
* Created a build script - output is in the `build` directory

## 1.1.3 (2012-08-18)
* Minor code improvement (make sure `selectionStart` is a `number`)
* Improved documentation formatting

## 1.1.2 (2012-07-14)
* Minor file size optimization

## 1.1.1 (2012-06-14)
* Added `tabSize()` method to get and set tab size

## 1.1.0 (2011-06-02)
* Added auto indent feature
* Fixed some IE edge cases
* Other minor improvements

## 1.0.0 (2010-05-18)
* Initial release