/*jslint browser: true */
/*global tabOverride */

(function (tabOverride, document) {
    'use strict';

    // get references to the elements on the page
    var textarea = document.getElementById('txt'),
        checkboxEnableTabOverride = document.getElementById('tab_override_enabled'),
        inputTabSize = document.getElementById('tab_override_tab_size'),
        checkboxAutoIndent = document.getElementById('tab_override_auto_indent'),
        checkboxAltKeys = document.getElementById('tab_override_alt_keys'),

        // use cmd key on Mac and ctrl key everywhere else
        modKeys = [/mac/i.test(navigator.platform) ? 'meta' : 'ctrl'];

    // enable/disable Tab Override when the checkbox value changes
    checkboxEnableTabOverride.onchange = function () {
        tabOverride.set(textarea, this.checked);
    };
    // initialize Tab Override last

    // update the tab size setting when the number changes
    inputTabSize.onchange = function () {
        var value = this.value,
            tabSize;

        tabOverride.tabSize(parseInt(value, 10));
        tabSize = tabOverride.tabSize();

        // don't display a non-accepted value
        if (value && value !== tabSize.toString()) {
            this.value = tabSize || '';
        }
    };
    inputTabSize.onchange(); // initialize

    // toggle auto indent when the checkbox value changes
    checkboxAutoIndent.onchange = function () {
        tabOverride.autoIndent(this.checked);
    };
    checkboxAutoIndent.onchange(); // initialize

    // toggle custom key combinations
    checkboxAltKeys.onchange = function () {
        if (this.checked) {
            tabOverride.tabKey(221, modKeys).untabKey(219, modKeys);
        } else {
            tabOverride.tabKey(9).untabKey(9, ['shift']);
        }
    };
    checkboxAltKeys.onchange(); // initialize

    // initialize Tab Override
    checkboxEnableTabOverride.onchange();
}(tabOverride, document));
