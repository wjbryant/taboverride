/*! taboverride.delay v0.1.0 | https://github.com/wjbryant/taboverride.delay
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

    var delay = 250,
        timeout,
        focusListener = tabOverride.utils.createListeners([{
            type: 'focus',
            handler: function (e) {
                var target;

                clearTimeout(timeout);

                // only remove and add listeners if delay is set
                if (delay) {
                    e = e || event;
                    target = e.target || e.srcElement;

                    tabOverride.utils.removeListeners(target);

                    timeout = setTimeout(function () {
                        tabOverride.utils.addListeners(target);
                    }, delay);
                }
            }
        }]);

    /**
     * Gets or sets the amount of time to delay before enabling Tab Override.
     * The default delay time is 250ms.
     *
     * @param  {number}        [ms]  the amount of time in milliseconds to
     *                               delay before enabling Tab Override
     * @return {number|Object}       the delay amount in milliseconds or the
     *                               tabOverride object
     *
     * @method external:tabOverride.delay
     */
    tabOverride.delay = function (ms) {
        if (arguments.length) {
            delay = typeof ms === 'number' && ms >= 0 ? ms : 0;
            return this;
        }
        return delay;
    };

    tabOverride.addExtension('set', function (elem, enable) {
        focusListener[enable ? 'add' : 'remove'](elem);
    });
}));
