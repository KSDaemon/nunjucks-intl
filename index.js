/* jshint node:true */
'use strict';

// Add all locale data to `NunjucksIntl`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

exports = module.exports = require('./lib/nunjucks-intl');
