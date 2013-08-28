/*jslint browser: true */
/*global require */

// load Tab Override
require(['../build/output/taboverride.min.js'], function (tabOverride) {
    'use strict';

    tabOverride.set(document.getElementById('txt'));
});
