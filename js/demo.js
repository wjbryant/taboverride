// v1.0.0

/*jshint browser: true */
/*global TABOVERRIDE */

(function (TABOVERRIDE, document) {
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
        TABOVERRIDE.set(textarea, this.checked);
    };
    checkboxEnableTabOverride.onchange(); // initialize

    // update the tab size setting when the number changes
    inputTabSize.onchange = function () {
        TABOVERRIDE.tabSize(parseInt(this.value, 10));
    };
    inputTabSize.onchange(); // initialize

    // toggle auto indent when the checkbox value changes
    checkboxAutoIndent.onchange = function () {
        TABOVERRIDE.autoIndent(this.checked);
    };
    checkboxAutoIndent.onchange(); // initialize

    // toggle custom key combinations
    checkboxAltKeys.onchange = function () {
        if (this.checked) {
            TABOVERRIDE.tabKey(221, modKeys).untabKey(219, modKeys);
        } else {
            TABOVERRIDE.tabKey(9).untabKey(9, ['shift']);
        }
    };
    checkboxAltKeys.onchange(); // initialize

}(TABOVERRIDE, document));
