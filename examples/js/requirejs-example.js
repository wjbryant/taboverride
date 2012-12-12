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

    var textarea = document.getElementById('txt');

    TABOVERRIDE.set(textarea);
});
