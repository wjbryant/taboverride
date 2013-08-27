/*! taboverride.escape v0.1.0 | https://github.com/wjbryant/taboverride.escape
Copyright (c) 2013 Bill Bryant | http://opensource.org/licenses/mit */

/*jslint browser: true */
/*global exports, require, define, tabOverride */

/**
 * The tabOverride namespace object
 *
 * @external tabOverride
 */

// use CommonJS or AMD if available
(function (factory) {
    'use strict';

    if (typeof exports === 'object' && typeof require === 'function') {
        // Node.js/CommonJS
        factory(require('taboverride'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD - register as an anonymous module
        // files must be concatenated using an AMD-aware tool such as r.js
        define(['taboverride'], factory);
    } else {
        // no module format - use global variable
        factory(tabOverride);
    }
}(function (tabOverride) {
    'use strict';

    var escape = true,
        listeners = tabOverride.utils.createListeners([
            {
                type: 'keydown',
                handler: function (e) {
                    e = e || event;
                    if (escape && e.keyCode === 27) {
                        tabOverride.utils.removeListeners(e.target || e.srcElement);
                    }
                }
            },
            {
                type: 'blur',
                handler: function (e) {
                    e = e || event;
                    tabOverride.utils.addListeners(e.target || e.srcElement);
                }
            }
        ]);

    /**
     * Gets or sets whether the escape extension is enabled (true) or disabled
     * (false).
     *
     * @param  {boolean}        [enable]  whether to enable the escape extension
     * @return {boolean|Object}           whether the escape extension is
     *                                    enabled or the tabOverride object
     *
     * @method external:tabOverride.escape
     */
    tabOverride.escape = function (enable) {
        if (arguments.length) {
            escape = enable ? true : false;
            return this;
        }
        return escape;
    };

    tabOverride.addExtension('set', function (elem, enable) {
        listeners[enable ? 'add' : 'remove'](elem);
    });
}));
