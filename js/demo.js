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
        inputDelay = document.getElementById('tab_override_delay'),
        checkboxEscape = document.getElementById('tab_override_escape'),
        checkboxStyle = document.getElementById('tab_override_style'),
        inputHardTabSize = document.getElementById('tab_override_hard_tab_size'),
        hardTabSizeDescription,

        // use cmd key on Mac and ctrl key everywhere else
        modKeys = [/mac/i.test(navigator.platform) ? 'meta' : 'ctrl'];


    // enable/disable Tab Override when the checkbox value changes
    // this is initialized last after all other settings have been initialized
    checkboxEnableTabOverride.onchange = function () {
        tabOverride.set(textarea, this.checked);
    };


    // update the tab size setting when the number changes
    inputTabSize.onchange = function () {
        tabOverride.tabSize(parseInt(this.value, 10));
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


    // Extensions

    // update the delay setting when the number changes
    inputDelay.onchange = function () {
        tabOverride.delay(parseInt(this.value, 10));
    };
    inputDelay.onchange(); // initialize

    // toggle escape extension
    checkboxEscape.onchange = function () {
        tabOverride.escape(this.checked);
    };
    checkboxEscape.onchange(); // initialize

    // toggle style extension
    checkboxStyle.onchange = function () {
        tabOverride.style(this.checked);
    };
    checkboxStyle.onchange(); // initialize

    // update the hard tab size setting when the number changes
    inputHardTabSize.onchange = function () {
        tabOverride.style.hardTabSize(parseInt(this.value, 10));
    };
    inputHardTabSize.onchange(); // initialize

    // disable hard tab size input if it is not supported
    if (!tabOverride.style.utils.hardTabSizeSupported) {
        inputHardTabSize.value = '';
        inputHardTabSize.disabled = true;
        inputHardTabSize.title = 'Not supported';
        hardTabSizeDescription = document.createElement('span');
        hardTabSizeDescription.className = 'description';
        hardTabSizeDescription.appendChild(document.createTextNode('(Not supported in this browser)'));
        inputHardTabSize.parentNode.appendChild(hardTabSizeDescription);
    }


    // initialize Tab Override last
    checkboxEnableTabOverride.onchange();
}(tabOverride, document));
