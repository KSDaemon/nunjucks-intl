/* global Nunjucks, Intl, IntlPolyfill */
/* jshint node:true */
'use strict';

// Force use of Intl.js Polyfill to serve as a mock.
require('intl');
Intl.NumberFormat   = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

var n = require('nunjucks');
var ne = new n.Environment({ throwOnUndefined: true });

global.Nunjucks = ne;
global.expect = require('expect.js');

require('../').registerWith(ne);

require('./helpers');
