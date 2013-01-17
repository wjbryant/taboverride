/*jslint browser: true */
/*global require */

// load Tab Override
require(['../build/taboverride.min.js'], function (TABOVERRIDE) {
    'use strict';

    var textarea = document.getElementById('txt');

    TABOVERRIDE.set(textarea);
});
