/* global Nunjucks, Intl, IntlPolyfill */
/* jshint node:true */
'use strict';

// Force use of Intl.js Polyfill to serve as a mock.
require('intl');
Intl.NumberFormat   = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

global.Nunjucks = require('handlebars');
global.expect = require('expect.js');

require('../').registerWith(Nunjucks);

require('./helpers');
