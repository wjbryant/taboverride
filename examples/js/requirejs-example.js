/*jslint browser: true */
/*global require */

require.config({
    // look in the build directory for modules
    baseUrl: '../build',
    paths: {
        // use the minified version of Tab Override
        // comment out this line to use the development version instead
        'taboverride': 'taboverride.min'
    }
});

// load Tab Override
require(['taboverride'], function (TABOVERRIDE) {
    'use strict';

    // "shortcut" for document
    var document = window.document,

        // get references to the elements on the page
        textarea = document.getElementById('txt'),
        checkboxEnableTabOverride = document.getElementById('tab_override_enabled'),
        inputTabSize = document.getElementById('tab_override_tab_size'),
        checkboxAutoIndent = document.getElementById('tab_override_auto_indent');

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
});
