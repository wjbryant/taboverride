/*! taboverride.style v0.1.0 | https://github.com/wjbryant/taboverride.style
Copyright (c) 2013 Bill Bryant | http://opensource.org/licenses/mit */

/*jslint browser: true */
/*global exports, require, define, tabOverride */

/**
 * The tabOverride namespace object
 *
 * @external tabOverride
 */

// use CommonJS or AMD if available
(function (factory) {
    'use strict';

    if (typeof exports === 'object' && typeof require === 'function') {
        // Node.js/CommonJS
        factory(require('taboverride'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD - register as an anonymous module
        // files must be concatenated using an AMD-aware tool such as r.js
        define(['taboverride'], factory);
    } else {
        // no module format - use global variable
        factory(tabOverride);
    }
}(function (tabOverride) {
    'use strict';

    var style = true,
        enabledClass = 'tabOverrideEnabled',
        activeClass = 'tabOverrideActive',
        hardTabSize = 4,
        styleElem,
        styleSheet,
        tabSizeRule,
        extraSelectors = [],
        // this is a live collection
        textareas = document.getElementsByTagName('textarea'),
        iElemStyle = document.createElement('i').style,

        /**
         * whether changing the display size of hard tabs is supported in this
         * browser
         *
         * @type boolean
         * @name external:tabOverride.style.utils.hardTabSizeSupported
         */
        hardTabSizeSupported = iElemStyle.tabSize === '' ||
            iElemStyle.MozTabSize === '' ||
            iElemStyle.OTabSize === '';


    // ***** Private Inner Functions *****

    /**
     * Adds an inline CSS class to an element.
     *
     * @private
     */
    function addClass(elem, cssClass) {
        // check if the element has the specified CSS class before adding it
        if (!(new RegExp('(?:^|\\s)' + cssClass + '(?:\\s|$)')).test(elem.className)) {
            elem.className += (elem.className ? ' ' : '') + cssClass;
        }
    }

    /**
     * Removes an inline CSS class from an element.
     *
     * @private
     */
    function removeClass(elem, cssClass) {
        elem.className = elem.className.replace(
            new RegExp('(?:^|\\s)' + cssClass + '(?=\\s|$)', 'g'),
            ''
        );
    }

    /**
     * Replaces an inline CSS class with a new one for the specified element.
     *
     * @param {Element} elem      the element on which to replace oldClass
     * @param {string}  oldClass  the class name to change
     * @param {string}  newClass  the class name with which to replace oldClass
     *
     * @private
     */
    function replaceClass(elem, oldClass, newClass) {
        elem.className = elem.className.replace(
            new RegExp('(^|\\s)' + oldClass + '(?=\\s|$)', 'g'),
            '$1' + newClass
        );
    }

    /**
     * Loops through all textareas and updates them to the new class. If no new
     * class is specified, the old class is removed.
     *
     * @param {string} oldClass    the class name to change
     * @param {string} [newClass]  the class name with which to replace oldClass
     *
     * @private
     */
    function updateClassOnTextareas(oldClass, newClass) {
        var editClass = newClass ? replaceClass : removeClass,
            len = textareas.length,
            i;

        for (i = 0; i < len; i += 1) {
            editClass(textareas[i], oldClass, newClass);
        }
    }

    /**
     * Changes the tab-size CSS property value.
     *
     * @param {number|string} tabSize  the value to use for the CSS tab-size property
     *
     * @private
     */
    function updateTabSizeCSSValue(tabSize) {
        tabSizeRule.style.MozTabSize = tabSize;
        tabSizeRule.style.OTabSize = tabSize;
        tabSizeRule.style.tabSize = tabSize;
    }

    /**
     * Updates the tab size CSS rule to use the current enabled class, active
     * class, extra selectors, and hard tab size.
     *
     * @private
     */
    function updateTabSizeCSSRule() {
        var selector = 'textarea.' + enabledClass;

        if (extraSelectors.length) {
            selector += ',' + extraSelectors.join(',')
                .replace(/\.\(enabledClass\)/g, '.' +  enabledClass)
                .replace(/\.\(activeClass\)/g, '.' + activeClass);
        }

        if (styleSheet.deleteRule) {
            if (styleSheet.cssRules.length) {
                styleSheet.deleteRule(0);
            }
            styleSheet.insertRule(selector + '{}', 0);
        } else if (styleSheet.removeRule) {
            // IE
            if (styleSheet.rules.length) {
                styleSheet.removeRule(0);
            }
            styleSheet.addRule(selector, '', 0);
        }

        tabSizeRule = (styleSheet.cssRules || styleSheet.rules)[0];

        // set tab-size declarations for the new rule
        updateTabSizeCSSValue(hardTabSize);
    }


    // ***** Private Utils - Exposed Under "utils" Namespace *****

    /**
     * Adds the enabled class to the specified element.
     *
     * @param {Element} elem  the element to which the enabled class will be added
     *
     * @method external:tabOverride.style.utils.addEnabledClass
     */
    function addEnabledClass(elem) {
        addClass(elem, enabledClass);
    }

    /**
     * Adds the active class to the specified element.
     *
     * @param {Element} elem  the element to which the active class will be added
     *
     * @method external:tabOverride.style.utils.addActiveClass
     */
    function addActiveClass(elem) {
        addClass(elem, activeClass);
    }

    /**
     * Removes the enabled class from the specified element.
     *
     * @param {Element} elem  the element from which the enabled class will be removed
     *
     * @method external:tabOverride.style.utils.removeEnabledClass
     */
    function removeEnabledClass(elem) {
        removeClass(elem, enabledClass);
    }

    /**
     * Removes the active class from the specified element.
     *
     * @param {Element} elem  the element from which the active class will be removed
     *
     * @method external:tabOverride.style.utils.removeActiveClass
     */
    function removeActiveClass(elem) {
        removeClass(elem, activeClass);
    }

    /**
     * Replaces the enabled class with the specified class name.
     *
     * @param {string} newClass  the new enabled class name
     *
     * @method external:tabOverride.style.utils.updateEnabledClass
     */
    function updateEnabledClass(newClass) {
        updateClassOnTextareas(enabledClass, newClass);
    }

    /**
     * Replaces the active class with the specified class name.
     *
     * @param {string} newClass  the new active class name
     *
     * @method external:tabOverride.style.utils.updateActiveClass
     */
    function updateActiveClass(newClass) {
        updateClassOnTextareas(activeClass, newClass);
    }

    /**
     * Adds a new selector string to the tab size CSS rule.
     *
     * @param {string} newSelector  the selector string to add to the tab size CSS rule
     *
     * @method external:tabOverride.style.utils.addTabSizeCSSSelector
     */
    function addTabSizeCSSSelector(newSelector) {
        extraSelectors.push(newSelector);
        updateTabSizeCSSRule();
    }

    /**
     * Removes a selector string from the tab size CSS rule.
     *
     * @param {string} cssSelector  the selector string to remove from the tab size CSS rule
     *
     * @method external:tabOverride.style.utils.removeTabSizeCSSSelector
     */
    function removeTabSizeCSSSelector(cssSelector) {
        var i,
            len = extraSelectors.length;

        for (i = 0; i < len; i += 1) {
            if (extraSelectors[i] === cssSelector) {
                extraSelectors.splice(i, 1);
                break;
            }
        }

        updateTabSizeCSSRule();
    }


    // ***** Public Methods *****

    /** @namespace external:tabOverride.style */

    /**
     * Enables or disables the style extension (default = enabled). The
     * 'setStyle' hook is executed whenever the style extension is enabled or
     * disabled. The extension function is passed a boolean value indicating
     * whether the extension was enabled (true) or disabled (false).
     *
     * @param  {boolean}        [enable]  whether to enable the style extension
     * @return {boolean|Object}           whether the style extension is enabled or the tabOverride object
     *
     * @method external:tabOverride.style(2)
     */
    tabOverride.style = function (enable) {
        var len,
            i,
            editEnabledClass,
            editActiveClass,
            currTextarea;

        if (arguments.length) {

            tabOverride.utils.executeExtensions('setStyle', [enable]);

            if (enable) {
                editEnabledClass = addEnabledClass;
                editActiveClass = addActiveClass;
                style = true;
            } else {
                editEnabledClass = removeEnabledClass;
                editActiveClass = removeActiveClass;
                style = false;
            }

            len = textareas.length;

            for (i = 0; i < len; i += 1) {
                currTextarea = textareas[i];
                if (currTextarea.getAttribute('data-taboverride-enabled')) {
                    editEnabledClass(currTextarea);
                    editActiveClass(currTextarea);
                }
            }

            return this;
        }

        return style;
    };

    /**
     * Gets or sets the "enabled" class name. (default = tabOverrideEnabled)
     *
     * @param  {string}          [newClass]  the new "enabled" class name
     * @return {string|Function}             the current "enabled" class name or tabOverride.style
     *
     * @method external:tabOverride.style.enabledClass
     */
    tabOverride.style.enabledClass = function (newClass) {
        if (arguments.length) {
            if (newClass && typeof newClass === 'string') {
                updateClassOnTextareas(enabledClass, newClass);
                enabledClass = newClass;
                updateTabSizeCSSRule();
            }
            return this;
        }
        return enabledClass;
    };

    /**
     * Gets or sets the "active" class name. (default = tabOverrideActive)
     *
     * @param  {string}          [newClass]  the new "active" class name
     * @return {string|Function}             the current "active" class name or tabOverride.style
     *
     * @method external:tabOverride.style.activeClass
     */
    tabOverride.style.activeClass = function (newClass) {
        if (arguments.length) {
            if (newClass && typeof newClass === 'string') {
                updateClassOnTextareas(activeClass, newClass);
                activeClass = newClass;
                updateTabSizeCSSRule();
            }
            return this;
        }
        return activeClass;
    };

    /**
     * Gets or sets the hard tab size. (default = 4)
     *
     * @param  {number}          [size]  the hard tab size
     * @return {number|Function}         the current hard tab size or tabOverride.style
     *
     * @method external:tabOverride.style.hardTabSize
     */
    tabOverride.style.hardTabSize = function (size) {
        if (arguments.length) {
            if (typeof size === 'number' && size > 0) {
                updateTabSizeCSSValue(size);
                hardTabSize = size;
            }
            return this;
        }
        return hardTabSize;
    };


    // ***** utils Namespace *****

    /** @namespace external:tabOverride.style.utils */
    tabOverride.style.utils = {
        hardTabSizeSupported: hardTabSizeSupported,
        addEnabledClass: addEnabledClass,
        addActiveClass: addActiveClass,
        removeEnabledClass: removeEnabledClass,
        removeActiveClass: removeActiveClass,
        updateEnabledClass: updateEnabledClass,
        updateActiveClass: updateActiveClass,
        addTabSizeCSSSelector: addTabSizeCSSSelector,
        removeTabSizeCSSSelector: removeTabSizeCSSSelector
    };


    // this was used to determine hard tab size support and is no longer needed
    iElemStyle = null;


    // create a new style sheet element
    if (document.createStyleSheet) {
        // IE
        styleSheet = document.createStyleSheet();
    } else {
        // add a new style element to the page
        styleElem = document.createElement('style');
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        styleSheet = styleElem.sheet || document.styleSheets[document.styleSheets - 1];
    }

    // create the CSS rule
    updateTabSizeCSSRule();


    // add the extension to Tab Override (hook into the set method)
    tabOverride.addExtension('set', function (elem, enable) {
        if (style) {
            if (enable) {
                addEnabledClass(elem);
                addActiveClass(elem);
            } else {
                removeEnabledClass(elem);
                removeActiveClass(elem);
            }
        }
    });

    // whenever the listeners are added, add the active class
    tabOverride.addExtension('addListeners', function (elem) {
        if (style) {
            addActiveClass(elem);
        }
    });

    // whenever the listeners are removed, remove the active class
    tabOverride.addExtension('removeListeners', function (elem) {
        if (style) {
            removeActiveClass(elem);
        }
    });
}));
