/*jslint browser: true */
/*global define */

/**
 * the TABOVERRIDE "namespace" global object
 *
 * @name TABOVERRIDE
 * @namespace
 */

// use AMD if available
(function (factory) {
    'use strict';

    // assign the module created by factory() to a global variable and return it
    function factoryWrapper() {
        var mod = window.TABOVERRIDE = factory();
        return mod;
    }

    if (typeof define === 'function' && define.amd) {
        // AMD - register as a named module, but still create a global variable
        // using a named module allows for non-AMD-aware concatenation
        define('taboverride', [], factoryWrapper);
    } else {
        // no AMD - just create the global variable
        factoryWrapper();
    }
}(function () {
    'use strict';

    var TABOVERRIDE = {},
        document = window.document,
        addHandlers,
        removeHandlers,
        overrideKeyDown,
        overrideKeyPress,
        aTab = '\t', // the string representing a tab
        autoIndent = false, // whether each line should be automatically indented
        inWhitespace = false, // whether the start of the selection is in the leading whitespace on enter
        ta = document.createElement('textarea'), // temp textarea element to get newline character(s)
        newline, // the newline character sequence (\n or \r\n)
        newlineLen; // the number of characters used for a newline (1 or 2)

    /**
     * Inserts or removes tabs and newlines on the keyDown event for the tab or enter key.
     *
     * @param {Event} e  the event object
     *
     * @private
     */
    overrideKeyDown = function (e) {
        e = e || event;

        var key = e.keyCode, // the key code for the key that was pressed
            tab, // the string representing a tab
            tabLen, // the length of a tab
            text, // initial text in the textarea
            range, // the IE TextRange object
            tempRange, // used to calculate selection start and end positions in IE
            preNewlines, // the number of newline character sequences before the selection start (for IE)
            selNewlines, // the number of newline character sequences within the selection (for IE)
            initScrollTop, // initial scrollTop value used to fix scrolling in Firefox
            selStart, // the selection start position
            selEnd, // the selection end position
            sel, // the selected text
            startLine, // for multi-line selections, the first character position of the first line
            endLine, // for multi-line selections, the last character position of the last line
            numTabs, // the number of tabs inserted / removed in the selection
            startTab, // if a tab was removed from the start of the first line
            preTab, // if a tab was removed before the start of the selection
            whitespace, // the whitespace at the beginning of the first selected line
            whitespaceLen, // the length of the whitespace at the beginning of the first selected line
            CHARACTER = 'character'; // string constant used for the Range.move methods

        // don't do any unnecessary work
        if ((key !== 9 && (key !== 13 || !autoIndent)) || e.ctrlKey || e.altKey) {
            return;
        }

        // initialize variables used for tab and enter keys
        inWhitespace = false; // this will be set to true if enter is pressed in the leading whitespace
        text = this.value;

        // this is really just for Firefox, but will be used by all browsers that support
        // selectionStart and selectionEnd - whenever the textarea value property is reset,
        // Firefox scrolls back to the top - this is used to set it back to the original value
        // scrollTop is nonstandard, but supported by all modern browsers
        initScrollTop = this.scrollTop;

        // get the text selection
        // prefer the nonstandard document.selection way since it allows for
        // automatic scrolling to the cursor via the range.select() method
        if (document.selection) { // IE
            range = document.selection.createRange();
            sel = range.text;
            tempRange = range.duplicate();
            tempRange.moveToElementText(this);
            tempRange.setEndPoint('EndToEnd', range);
            selEnd = tempRange.text.length;
            selStart = selEnd - sel.length;

            // whenever the value of the textarea is changed, the range needs to be reset
            // IE <9 (and Opera) use both \r and \n for newlines - this adds an extra character
            // that needs to be accounted for when doing position calculations with ranges
            // these values are used to offset the selection start and end positions
            if (newlineLen > 1) {
                preNewlines = text.slice(0, selStart).split(newline).length - 1;
                selNewlines = sel.split(newline).length - 1;
            } else {
                preNewlines = selNewlines = 0;
            }
        } else if (typeof this.selectionStart === 'number') {
            selStart = this.selectionStart;
            selEnd = this.selectionEnd;
            sel = text.slice(selStart, selEnd);
        } else {
            return; // cannot access textarea selection - do nothing
        }

        // tab key - insert / remove tab
        if (key === 9) {

            // initialize tab variables
            tab = aTab;
            tabLen = tab.length;
            numTabs = 0;
            startTab = 0;
            preTab = 0;

            // multi-line selection
            if (selStart !== selEnd && sel.indexOf('\n') !== -1) {
                // for multiple lines, only insert / remove tabs from the beginning of each line

                // find the start of the first selected line
                if (selStart === 0 || text.charAt(selStart - 1) === '\n') {
                    // the selection starts at the beginning of a line
                    startLine = selStart;
                } else {
                    // the selection starts after the beginning of a line
                    // set startLine to the beginning of the first partially selected line
                    // subtract 1 from selStart in case the cursor is at the newline character,
                    // for instance, if the very end of the previous line was selected
                    // add 1 to get the next character after the newline
                    // if there is none before the selection, lastIndexOf returns -1
                    // when 1 is added to that it becomes 0 and the first character is used
                    startLine = text.lastIndexOf('\n', selStart - 1) + 1;
                }

                // find the end of the last selected line
                if (selEnd === text.length || text.charAt(selEnd) === '\n') {
                    // the selection ends at the end of a line
                    endLine = selEnd;
                } else {
                    // the selection ends before the end of a line
                    // set endLine to the end of the last partially selected line
                    endLine = text.indexOf('\n', selEnd);
                    if (endLine === -1) {
                        endLine = text.length;
                    }
                }

                // if the shift key was pressed, remove tabs instead of inserting them
                if (e.shiftKey) {
                    if (text.slice(startLine).indexOf(tab) === 0) {
                        // is this tab part of the selection?
                        if (startLine === selStart) {
                            // it is, remove it
                            sel = sel.slice(tabLen);
                        } else {
                            // the tab comes before the selection
                            preTab = tabLen;
                        }
                        startTab = tabLen;
                    }

                    this.value = text.slice(0, startLine) + text.slice(startLine + preTab, selStart) +
                        sel.replace(new RegExp('\n' + tab, 'g'), function () {
                            numTabs += 1;
                            return '\n';
                        }) + text.slice(selEnd);

                    // set start and end points
                    if (range) { // IE
                        // setting end first makes calculations easier
                        range.collapse();
                        range.moveEnd(CHARACTER, selEnd - startTab - (numTabs * tabLen) - selNewlines - preNewlines);
                        range.moveStart(CHARACTER, selStart - preTab - preNewlines);
                        range.select();
                    } else {
                        // set start first for Opera
                        this.selectionStart = selStart - preTab; // preTab is 0 or tabLen
                        // move the selection end over by the total number of tabs removed
                        this.selectionEnd = selEnd - startTab - (numTabs * tabLen);
                    }
                } else { // no shift key
                    numTabs = 1; // for the first tab
                    // insert tabs at the beginning of each line of the selection
                    this.value = text.slice(0, startLine) + tab + text.slice(startLine, selStart) +
                        sel.replace(/\n/g, function () {
                            numTabs += 1;
                            return '\n' + tab;
                        }) + text.slice(selEnd);

                    // set start and end points
                    if (range) { // IE
                        range.collapse();
                        range.moveEnd(CHARACTER, selEnd + (numTabs * tabLen) - selNewlines - preNewlines);
                        range.moveStart(CHARACTER, selStart + tabLen - preNewlines);
                        range.select();
                    } else {
                        // the selection start is always moved by 1 character
                        this.selectionStart = selStart + tabLen;
                        // move the selection end over by the total number of tabs inserted
                        this.selectionEnd = selEnd + (numTabs * tabLen);
                        this.scrollTop = initScrollTop;
                    }
                }
            } else { // single line selection
                // if the shift key was pressed, remove a tab instead of inserting one
                if (e.shiftKey) {
                    // if the character before the selection is a tab, remove it
                    if (text.slice(selStart - tabLen).indexOf(tab) === 0) {
                        this.value = text.slice(0, selStart - tabLen) + text.slice(selStart);

                        // set start and end points
                        if (range) { // IE
                            // collapses range and moves it by -1 tab
                            range.move(CHARACTER, selStart - tabLen - preNewlines);
                            range.select();
                        } else {
                            this.selectionEnd = this.selectionStart = selStart - tabLen;
                            this.scrollTop = initScrollTop;
                        }
                    }
                } else { // no shift key - insert a tab
                    if (range) { // IE
                        range.text = tab;
                        range.select();
                    } else {
                        this.value = text.slice(0, selStart) + tab + text.slice(selEnd);
                        this.selectionEnd = this.selectionStart = selStart + tabLen;
                        this.scrollTop = initScrollTop;
                    }
                }
            }
        } else if (autoIndent) { // Enter key
            // insert a newline and copy the whitespace from the beginning of the line

            // find the start of the first selected line
            if (selStart === 0 || text.charAt(selStart - 1) === '\n') {
                // the selection starts at the beginning of a line
                // do nothing special
                inWhitespace = true;
                return;
            }

            // see explanation under "multi-line selection" above
            startLine = text.lastIndexOf('\n', selStart - 1) + 1;

            // find the end of the first selected line
            endLine = text.indexOf('\n', selStart);

            // if no newline is found, set endLine to the end of the text
            if (endLine === -1) {
                endLine = text.length;
            }

            // get the whitespace at the beginning of the first selected line (spaces and tabs only)
            whitespace = text.slice(startLine, endLine).match(/^[ \t]*/)[0];
            whitespaceLen = whitespace.length;

            // the cursor (selStart) is in the whitespace at beginning of the line
            // do nothing special
            if (selStart < startLine + whitespaceLen) {
                inWhitespace = true;
                return;
            }

            if (range) { // IE
                // insert the newline and whitespace
                range.text = '\n' + whitespace;
                range.select();
            } else {
                // insert the newline and whitespace
                this.value = text.slice(0, selStart) + '\n' + whitespace + text.slice(selEnd);
                // Opera uses \r\n for a newline, instead of \n,
                // so use newlineLen instead of a hard-coded value
                this.selectionEnd = this.selectionStart = selStart + newlineLen + whitespaceLen;
                this.scrollTop = initScrollTop;
            }
        }

        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
            return false;
        }
    };

    /**
     * Prevents the default action for the keyPress event when tab or enter is
     * pressed. Opera (and Firefox) also fire a keypress event when the tab or
     * enter key is pressed. Opera requires that the default action be prevented
     * on this event or the textarea will lose focus.
     *
     * @param {Event} e  the event object
     *
     * @private
     */
    overrideKeyPress = function (e) {
        e = e || event;

        var key = e.keyCode;

        if ((key === 9 || (key === 13 && autoIndent && !inWhitespace)) && !e.ctrlKey && !e.altKey) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
                return false;
            }
        }
    };

    // use the standard event handler registration method when available
    if (document.addEventListener) {
        /**
         * Adds the Tab Override event handlers to the specified element.
         *
         * @param {Element} elem  the element to which the handlers will be added
         *
         * @private
         */
        addHandlers = function (elem) {
            // remove handlers before adding them to make sure they are not
            // added more than once
            removeHandlers(elem);

            elem.addEventListener('keydown', overrideKeyDown, false);
            elem.addEventListener('keypress', overrideKeyPress, false);
        };

        /**
         * Removes the Tab Override event handlers from the specified element.
         *
         * @param {Element} elem  the element from which the handlers will be removed
         *
         * @private
         */
        removeHandlers = function (elem) {
            elem.removeEventListener('keydown', overrideKeyDown, false);
            elem.removeEventListener('keypress', overrideKeyPress, false);
        };

    // support IE 6,7,8 
    } else if (document.attachEvent) {
        /** @ignore */
        addHandlers = function (elem) {
            // remove handlers before adding them to make sure they are not
            // added more than once
            removeHandlers(elem);

            elem.attachEvent('onkeydown', overrideKeyDown);
            elem.attachEvent('onkeypress', overrideKeyPress);
        };

        /** @ignore */
        removeHandlers = function (elem) {
            elem.detachEvent('onkeydown', overrideKeyDown);
            elem.detachEvent('onkeypress', overrideKeyPress);
        };

    // browser not supported
    } else {
        /** @ignore */
        addHandlers = /** @ignore */ removeHandlers = function () {};
    }

    /**
     * Enables or disables Tab Override for the specified textarea element(s).
     *
     * @param  {Element|Element[]} elems          the textarea element(s) for
     *                                            which to enable or disable
     *                                            Tab Override
     * @param  {Boolean}           [enable=true]  whether Tab Override should be
     *                                            enabled for the element(s)
     * @return {Object}                           the TABOVERRIDE object
     *
     * @name set
     * @function
     * @memberOf TABOVERRIDE
     */
    TABOVERRIDE.set = function (elems, enable) {
        var func,
            i,
            len,
            elemsArr,
            elem;

        if (elems) {
            func = arguments.length < 2 || enable ?
                    addHandlers : removeHandlers;

            // don't manipulate param when referencing arguments object
            elemsArr = elems;
            len = elemsArr.length;

            if (typeof len !== 'number') {
                elemsArr = [elemsArr];
                len = 1;
            }

            for (i = 0; i < len; i += 1) {
                elem = elemsArr[i];
                if (elem && elem.nodeName && elem.nodeName.toLowerCase() === 'textarea') {
                    func(elem);
                }
            }
        }

        return this;
    };

    /**
     * Gets or sets the tab size for all elements that have Tab Override enabled.
     * 0 represents the tab character.
     *
     * @param  {Number}        [size]  the tab size
     * @return {Number|Object}         the tab size or the TABOVERRIDE object
     *
     * @name tabSize
     * @function
     * @memberOf TABOVERRIDE
     */
    TABOVERRIDE.tabSize = function (size) {
        var i;

        if (arguments.length) {
            if (!size) { // size is 0 (or falsy)
                aTab = '\t';
            } else if (typeof size === 'number' && size > 0) {
                aTab = '';
                for (i = 0; i < size; i += 1) {
                    aTab += ' ';
                }
            }
            return this;
        }

        return (aTab === '\t') ? 0 : aTab.length;
    };

    /**
     * Gets or sets the auto indent setting. True if each line should be
     * automatically indented (default = false).
     *
     * @param  {Boolean}        [enable]  whether auto indent should be enabled
     * @return {Boolean|Object}           whether auto indent is enabled or the
     *                                    TABOVERRIDE object
     *
     * @name autoIndent
     * @function
     * @memberOf TABOVERRIDE
     */
    TABOVERRIDE.autoIndent = function (enable) {
        if (arguments.length) {
            autoIndent = enable ? true : false;
            return this;
        }

        return autoIndent;
    };

    // get the characters used for a newline
    ta.value = '\n';
    newline = ta.value;
    newlineLen = newline.length;
    ta = null;

    return TABOVERRIDE;
}));
