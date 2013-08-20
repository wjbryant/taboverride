/*jslint browser: true */
/*global exports, define */

// use CommonJS or AMD if available
(function (factory) {
    'use strict';

    var mod;

    if (typeof exports === 'object') {
        // Node.js/CommonJS
        factory(exports);
    } else if (typeof define === 'function' && define.amd) {
        // AMD - register as an anonymous module
        // files must be concatenated using an AMD-aware tool such as r.js
        define(['exports'], factory);
    } else {
        // no module format - create global variable
        mod = window.tabOverride = {};
        factory(mod);
    }
}(