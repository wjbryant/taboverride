// Tab Override jQuery Wrapper
// Requires: jQuery 1.7+ and Tab Override 2.0+

/*global jQuery, TABOVERRIDE */

/**
 * the global jQuery object
 *
 * @name jQuery
 * @namespace
 */

/**
 * the jQuery function "namespace"
 *
 * @name fn
 * @namespace
 * @memberOf jQuery
 */

(function ($, TABOVERRIDE) {
    'use strict';

    /**
     * the tabOverride method - Tabs will be overridden if enable is true.
     *
     * @param  {Boolean} [enable=true]  whether Tab Override should be enabled
     *                                  for the element(s)
     * @return {Object}                 the jQuery object
     *
     * @name tabOverride
     * @memberOf jQuery.fn
     * @function
     * @namespace
     */
    var tabOverride = $.fn.tabOverride = function (enable) {
        // unbind the tab override functions so they are not bound more than once
        this.each(function () {
            $(this).off('.tabOverride');
        });

        // only bind the tab override functions if the enable argument is not
        // specified or is truthy
        if (!arguments.length || enable) {
            this.each(function () {
                if (this.nodeName && this.nodeName.toLowerCase() === 'textarea') {
                    $(this)
                        .on('keydown.tabOverride', TABOVERRIDE.overrideKeyDown)
                        .on('keypress.tabOverride', TABOVERRIDE.overrideKeyPress);
                }
            });
        }

        return this; // always return the jQuery object
    };

    /**
     * Gets or sets the tab size for all elements that have Tab Override enabled.
     * 0 represents the tab character.
     *
     * @param  {Number}          [size]  the tab size
     * @return {Number|Function}         the tab size or the tabOverride function
     *
     * @name tabSize
     * @function
     * @memberOf jQuery.fn.tabOverride
     */
    tabOverride.tabSize = TABOVERRIDE.tabSize;

    /**
     * Returns the current tab size. 0 represents the tab character.
     *
     * @return {Number}  the size (length) of the tab string or 0 for the tab
     *                   character
     *
     * @name getTabSize
     * @function
     * @memberOf jQuery.fn.tabOverride
     * @deprecated since 2.0 - use tabSize() instead
     */
    tabOverride.getTabSize = function () {
        return this.tabSize();
    };

    /**
     * Sets the tab size for all elements that have Tab Override enabled.
     * 0 represents the tab character. The initial value is 0.
     *
     * @param  {Number}   [size=0]  the tab size
     * @return {Function}           the tabOverride function
     *
     * @name setTabSize
     * @function
     * @memberOf jQuery.fn.tabOverride
     * @deprecated since 2.0 - use tabSize() instead
     */
    tabOverride.setTabSize = function (size) {
        return this.tabSize(size || 0);
    };

    /**
     * Gets or sets the auto indent setting. True if each line should be
     * automatically indented (default = false).
     *
     * @param  {Boolean}          [enable]  whether auto indent should be enabled
     * @return {Boolean|Function}           whether auto indent is enabled or the
     *                                      tabOverride function
     *
     * @name autoIndent
     * @function
     * @memberOf jQuery.fn.tabOverride
     */
    tabOverride.autoIndent = TABOVERRIDE.autoIndent;
}(jQuery, TABOVERRIDE));