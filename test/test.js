/*jslint browser: true */
/*global TABOVERRIDE, QUnit, module, test, ok, strictEqual */

(function () {
    'use strict';

    function resetSettings() {
        TABOVERRIDE
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

        TABOVERRIDE.overrideKeyDown.call(textarea, e);
    }

    function testReturnValue(func) {
        test('returns TABOVERRIDE object', 4, function () {
            strictEqual(func.apply(TABOVERRIDE, [undefined]), TABOVERRIDE, 'undefined argument');
            strictEqual(func.apply(TABOVERRIDE, [-1]), TABOVERRIDE, 'negative number argument');
            strictEqual(func.apply(TABOVERRIDE, [2]), TABOVERRIDE, 'positive number argument');
            strictEqual(func.apply(TABOVERRIDE, [2, []]), TABOVERRIDE, 'multiple arguments');
        });
    }

    function normalizeNewlines(text) {
        return text.replace(/\r\n/g, '\n');
    }

    function setCaretPosition(textarea, start, end) {
        var preNewlines,
            selNewlines,
            range;

        if (typeof end !== 'number') {
            end = start;
        }

        textarea.focus();

        if (typeof textarea.selectionStart === 'number') {
            textarea.setSelectionRange(start, end);
        } else if (textarea.createTextRange) {
            // newlines are \r\n when working with ranges
            // count the number of newlines before the start
            preNewlines = textarea.value.slice(0, start).split('\n').length - 1;
            // count the number of newlines in the selection
            selNewlines = textarea.value.slice(start, end).split('\n').length - 1;

            range = textarea.createTextRange();
            range.collapse(true);
            range.moveEnd('character', preNewlines + selNewlines + end);
            range.moveStart('character', preNewlines + start);
            range.select();
        }
    }

    function getTextarea() {
        return document.getElementById('qunit-fixture').getElementsByTagName('textarea')[0];
    }

    QUnit.testStart(resetSettings);


    module('globals');

    test('TABOVERRIDE object created', 1, function () {
        ok(window.TABOVERRIDE, 'window.TABOVERRIDE exists');
    });


    module('tabSize()');

    test('invalid arguments', 2, function () {
        TABOVERRIDE.tabSize(-1);
        strictEqual(TABOVERRIDE.tabSize(), 0, 'negative number');

        TABOVERRIDE.tabSize('4');
        strictEqual(TABOVERRIDE.tabSize(), 0, 'string');
    });

    test('number arguments correctly set', 2, function () {
        TABOVERRIDE.tabSize(4);
        strictEqual(TABOVERRIDE.tabSize(), 4, 'tabSize was set to 4');

        TABOVERRIDE.tabSize(0);
        strictEqual(TABOVERRIDE.tabSize(), 0, 'tabSize was set to 0');
    });

    testReturnValue(TABOVERRIDE.tabSize);


    module('autoIndent()');

    test('value correctly set', 5, function () {
        TABOVERRIDE.autoIndent(false);
        strictEqual(TABOVERRIDE.autoIndent(), false, 'false -> false');

        TABOVERRIDE.autoIndent(true);
        strictEqual(TABOVERRIDE.autoIndent(), true, 'true -> true');

        TABOVERRIDE.autoIndent(0);
        strictEqual(TABOVERRIDE.autoIndent(), false, '0 -> false');

        TABOVERRIDE.autoIndent(1);
        strictEqual(TABOVERRIDE.autoIndent(), true, '1 -> true');

        TABOVERRIDE.autoIndent(undefined);
        strictEqual(TABOVERRIDE.autoIndent(), false, 'undefined -> false');
    });

    testReturnValue(TABOVERRIDE.autoIndent);


    module('tabKey()');

    test('value correctly set', 1, function () {
        TABOVERRIDE.tabKey(221);
        strictEqual(TABOVERRIDE.tabKey(), '221', 'number argument');
    });

    testReturnValue(TABOVERRIDE.tabKey);


    module('untabKey()');

    test('value correctly set', 1, function () {
        TABOVERRIDE.untabKey(219);
        strictEqual(TABOVERRIDE.untabKey(), '219', 'number argument');
    });

    testReturnValue(TABOVERRIDE.untabKey);


    module('single line');

    test('insert tab', 1, function () {
        var textarea = getTextarea();

        // set up textarea
        textarea.value = 'example text';
        setCaretPosition(textarea, 0);

        // insert tab
        simulateKeyDown(textarea);

        strictEqual(textarea.value, '\texample text', 'tab inserted at start of line');
    });

    test('remove tab', 1, function () {
        var textarea = getTextarea();

        // set up textarea
        textarea.value = '\texample text';
        setCaretPosition(textarea, 1);

        // remove tab
        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(textarea.value, 'example text', 'tab removed from start of line');
    });


    module('multi-line');

    test('indent multiple lines', 2, function () {
        var textarea = getTextarea(),
            sampleText = 'this is line one\nthis is line two\nthis is line three';

        textarea.value = sampleText;
        setCaretPosition(textarea, 5, 24);

        simulateKeyDown(textarea);

        strictEqual(normalizeNewlines(textarea.value), '\tthis is line one\n\tthis is line two\nthis is line three', 'tabs inserted at start of lines 1 and 2');

        // reset textarea
        textarea.value = sampleText;
        setCaretPosition(textarea, 5, 24);

        // use 4 spaces instead of tab character
        TABOVERRIDE.tabSize(4);
        simulateKeyDown(textarea);

        strictEqual(normalizeNewlines(textarea.value), '    this is line one\n    this is line two\nthis is line three', '4 spaces inserted at start of lines 1 and 2');
    });

    test('unindent multiple lines', 2, function () {
        var textarea = getTextarea(),
            nonIndentedText = 'this is line one\nthis is line two\nthis is line three';

        textarea.value = '\tthis is line one\n\tthis is line two\nthis is line three';
        setCaretPosition(textarea, 6, 26);

        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(normalizeNewlines(textarea.value), nonIndentedText, 'tabs removed at start of lines 1 and 2');

        // reset textarea
        textarea.value = '    this is line one\n    this is line two\nthis is line three';
        setCaretPosition(textarea, 9, 32);

        // use 4 spaces instead of tab character
        TABOVERRIDE.tabSize(4);
        simulateKeyDown(textarea, 9, ['shift']);

        strictEqual(normalizeNewlines(textarea.value), nonIndentedText, '4 spaces removed at start of lines 1 and 2');
    });
}());
