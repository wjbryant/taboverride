/*jslint browser: true */
/*global tabOverride, QUnit, module, test, ok, strictEqual */

(function (window, document) {
    'use strict';

    function resetSettings() {
        tabOverride
            .tabSize(0)
            .autoIndent(false)
            .tabKey(9)
            .untabKey(9, ['shift']);
    }

    function simulateKeyDown(textarea, keyCode, modifierKeys) {
        var i,
            e = {
                currentTarget: textarea,
                keyCode: keyCode || 9
            };

        if (modifierKeys && modifierKeys.length) {
            for (i = 0; i < modifierKeys.length; i += 1) {
                e[modifierKeys[i] + 'Key'] = true;
            }
        }

        tabOverride.handlers.keydown.call(textarea, e);
    }

    function testReturnValue(func) {
        test('returns tabOverride object', 5, function () {
            strictEqual(func.apply(tabOverride, [undefined]), tabOverride, 'undefined argument');
            strictEqual(func.apply(tabOverride, ['']), tabOverride, 'empty string argument');
            strictEqual(func.apply(tabOverride, [-1]), tabOverride, 'negative number argument');
            strictEqual(func.apply(tabOverride, [2]), tabOverride, 'positive number argument');
            strictEqual(func.apply(tabOverride, [2, []]), tabOverride, 'multiple arguments');
        });
    }

    function normalizeNewlines(text) {
        return text.replace(/\r\n/g, '\n');
    }

    function removeIndentation(text) {
        return text.replace(/^[\t ]+/m, '');
    }

    function getTextSelection(textarea) {
        var sel;

        if (typeof textarea.selectionStart === 'number') {
            sel = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
        } else if (document.selection) {
            sel = document.selection.createRange().text;
        }

        return sel;
    }

    function setTextSelection(textarea, start, end) {
        var range;

        if (typeof end !== 'number') {
            end = start;
        }

        if (typeof textarea.selectionStart === 'number') {
            textarea.focus();
            textarea.setSelectionRange(start, end);
        } else if (textarea.createTextRange) {
            range = textarea.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }

    function getTextarea() {
        return document.getElementById('qunit-fixture').getElementsByTagName('textarea')[0];
    }

    QUnit.testStart(resetSettings);


    module('globals');

    test('tabOverride object created', 1, function () {
        ok(window.tabOverride, 'window.tabOverride exists');
    });


    module('tabSize()');

    test('number arguments correctly set', 2, function () {
        tabOverride.tabSize(4);
        strictEqual(tabOverride.tabSize(), 4, '4 should set tab size to 4');

        tabOverride.tabSize(0);
        strictEqual(tabOverride.tabSize(), 0, '0 should set tab size to 0');
    });

    test('invalid arguments', 2, function () {
        // invalid arguments set tab size to 0

        tabOverride.tabSize(2); // intial value
        tabOverride.tabSize(-1);
        strictEqual(tabOverride.tabSize(), 0, 'negative number argument should set tab size to 0');

        tabOverride.tabSize(2); // initial value
        tabOverride.tabSize('4');
        strictEqual(tabOverride.tabSize(), 0, 'string argument should set tab size to 0');
    });
    
    testReturnValue(tabOverride.tabSize);


    module('autoIndent()');

    test('value correctly set', 5, function () {
        tabOverride.autoIndent(false);
        strictEqual(tabOverride.autoIndent(), false, 'false -> false');

        tabOverride.autoIndent(true);
        strictEqual(tabOverride.autoIndent(), true, 'true -> true');

        tabOverride.autoIndent(0);
        strictEqual(tabOverride.autoIndent(), false, '0 -> false');

        tabOverride.autoIndent(1);
        strictEqual(tabOverride.autoIndent(), true, '1 -> true');

        tabOverride.autoIndent(undefined);
        strictEqual(tabOverride.autoIndent(), false, 'undefined -> false');
    });

    testReturnValue(tabOverride.autoIndent);


    module('tabKey()');

    test('value correctly set', 1, function () {
        tabOverride.tabKey(221);
        strictEqual(tabOverride.tabKey(), '221', 'number argument');
    });

    testReturnValue(tabOverride.tabKey);


    module('untabKey()');

    test('value correctly set', 1, function () {
        tabOverride.untabKey(219);
        strictEqual(tabOverride.untabKey(), '219', 'number argument');
    });

    testReturnValue(tabOverride.untabKey);


    module('single line');

    test('insert tab', 1, function () {
        var textarea = getTextarea();

        // set up textarea
        textarea.value = 'example text';
        setTextSelection(textarea, 0);

        // insert tab
        simulateKeyDown(textarea, 9);

        strictEqual(textarea.value, '\texample text', 'tab inserted at start of line');
    });

    test('remove tab', 1, function () {
        var textarea = getTextarea();

        // set up textarea
        textarea.value = '\texample text';
        setTextSelection(textarea, 1);

        // remove tab
        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(textarea.value, 'example text', 'tab removed from start of line');
    });


    module('multi-line');

    test('indent multiple lines', 4, function () {
        var textarea = getTextarea(),
            sampleText = 'this is line one\nthis is line two\nthis is line three';

        textarea.value = sampleText;
        setTextSelection(textarea, 5, 24);

        simulateKeyDown(textarea, 9);

        strictEqual(normalizeNewlines(textarea.value), '\tthis is line one\n\tthis is line two\nthis is line three', 'tabs inserted at start of lines 1 and 2');
        strictEqual(normalizeNewlines(removeIndentation(getTextSelection(textarea))), sampleText.slice(5, 24), 'selection should be unchanged after inserting tabs');

        // reset textarea
        textarea.value = sampleText;
        setTextSelection(textarea, 5, 24);

        // use 4 spaces instead of tab character
        tabOverride.tabSize(4);
        simulateKeyDown(textarea, 9);

        strictEqual(normalizeNewlines(textarea.value), '    this is line one\n    this is line two\nthis is line three', '4 spaces inserted at start of lines 1 and 2');
        strictEqual(normalizeNewlines(removeIndentation(getTextSelection(textarea))), sampleText.slice(5, 24), 'selection should be unchanged after inserting 4 spaces');
    });

    test('unindent multiple lines', 4, function () {
        var textarea = getTextarea(),
            nonIndentedText = 'this is line one\nthis is line two\nthis is line three';

        textarea.value = '\tthis is line one\n\tthis is line two\nthis is line three';
        setTextSelection(textarea, 6, 26);

        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(normalizeNewlines(textarea.value), nonIndentedText, 'tabs removed at start of lines 1 and 2');
        strictEqual(normalizeNewlines(removeIndentation(getTextSelection(textarea))), nonIndentedText.slice(5, 24), 'selection should be unchanged after removing tabs');

        // reset textarea
        textarea.value = '    this is line one\n    this is line two\nthis is line three';
        setTextSelection(textarea, 9, 32);

        // use 4 spaces instead of tab character
        tabOverride.tabSize(4);
        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(normalizeNewlines(textarea.value), nonIndentedText, '4 spaces removed at start of lines 1 and 2');
        strictEqual(normalizeNewlines(removeIndentation(getTextSelection(textarea))), nonIndentedText.slice(5, 24), 'selection should be unchanged after removing 4 spaces');
    });


    module('extensions');

    test('add extensions', 1, function () {
        var textarea = getTextarea(),
            extension = this.spy();

        tabOverride.addExtension('set', extension);
        tabOverride.set(textarea);

        ok(extension.calledOnce, 'extension functions are added and executed');
    });


    module('utils');

    test('executeExtensions', 2, function () {
        var extension = this.spy();

        tabOverride.addExtension('testHook', extension);
        tabOverride.utils.executeExtensions('testHook', [1, 2]);

        strictEqual(extension.calledOnce, true, 'extension executed');
        strictEqual(extension.firstCall.calledWith(1, 2), true, 'arguments passed');
    });

    test('isValidModifierKeyCombo', 4, function () {
        strictEqual(
            tabOverride.utils.isValidModifierKeyCombo(
                ['ctrlKey', 'shiftKey'],
                { ctrlKey: true, shiftKey: true }
            ),
            true,
            'exact match'
        );

        strictEqual(
            tabOverride.utils.isValidModifierKeyCombo(
                ['ctrlKey', 'shiftKey'],
                { altKey: true, ctrlKey: true, shiftKey: true }
            ),
            false,
            'extra key'
        );

        strictEqual(
            tabOverride.utils.isValidModifierKeyCombo(
                ['ctrlKey', 'shiftKey'],
                { ctrlKey: true }
            ),
            false,
            'missing key'
        );

        strictEqual(
            tabOverride.utils.isValidModifierKeyCombo(['altKey'], {}),
            false,
            'no keys'
        );
    });

    test('createListeners', 2, function () {
        var textarea = getTextarea(),
            handler = this.spy(),
            listeners = tabOverride.utils.createListeners([{
                type: 'focus',
                handler: handler
            }]);

        listeners.add(textarea);

        // trigger event
        textarea.blur();
        textarea.focus();

        // check that handler was called
        ok(handler.calledOnce, 'event listener registered and called');


        listeners.remove(textarea);

        // trigger event
        textarea.blur();
        textarea.focus();

        // check that handler was not called again
        ok(handler.calledOnce, 'event listener removed');
    });
}(window, document));
