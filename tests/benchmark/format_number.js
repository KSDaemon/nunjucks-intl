'use strict';

global.Intl || require('intl');

var Nunjucks     = require('handlebars'),
    hbsIntlHelpers = require('../../');

hbsIntlHelpers.registerWith(Nunjucks);

var formatNumber = Nunjucks.helpers.formatNumber;

module.exports = function () {
    formatNumber(4000, {
        data: {},
        hash: {}
    });
};
