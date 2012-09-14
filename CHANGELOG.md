# Tab Override Changelog

## 2.0 (2012-09-14)
* Separated the Tab Override core and jQuery code - 
  this allows easier integration with other JS libraries
* Exposed core functionality through the `TABOVERRIDE` global object
* Changed `autoIndent` to a `function` -
  ex: `$.fn.tabOverride.autoIndent(true);`
* `autoIndent()` and `tabSize()` now return `$.fn.tabOverride` when used as setters
* Deprecated `getTabSize()` and `setTabSize()` - use `tabSize()` instead
* The jQuery plugin now requires jQuery v1.7+
* Created a build script - output is in the `build` directory

## 1.1.3 (2012-08-18)
* Minor code improvement (make sure `selectionStart` is a `number`)
* Improved documentation formatting

## 1.1.2 (2012-07-14)
* Minor file size optimization

## 1.1.1 (2012-06-14)
* Added `tabOverride.tabSize()` function to get and set tab size

## 1.1 (2011-06-02)
* Added auto indent feature
* Fixed some IE edge cases
* Other minor improvements

## 1.0 (2010-05-18)
* Initial release