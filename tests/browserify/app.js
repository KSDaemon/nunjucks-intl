/* global Nunjucks */
'use strict';

var NunjucksIntl = require('../../');
require('../../lib/locales.js');

global.Nunjucks = require('handlebars');
NunjucksIntl.registerWith(Nunjucks);

require('../helpers.js');
