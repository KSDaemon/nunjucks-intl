"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWith = registerWith;

var _intlMessageformat = _interopRequireDefault(require("intl-messageformat"));

var _intlRelativeformat = _interopRequireDefault(require("intl-relativeformat"));

var _intlFormatCache = _interopRequireDefault(require("intl-format-cache"));

var _utils = require("./utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var getNumberFormat = (0, _intlFormatCache["default"])(Intl.NumberFormat);
var getDateTimeFormat = (0, _intlFormatCache["default"])(Intl.DateTimeFormat);
var getMessageFormat = (0, _intlFormatCache["default"])(_intlMessageformat["default"]);
var getRelativeFormat = (0, _intlFormatCache["default"])(_intlRelativeformat["default"]);

function registerWith(Nunjucks) {
  var helpers = {
    intlGet: intlGet,
    formatDate: formatDate,
    formatTime: formatTime,
    formatRelative: formatRelative,
    formatNumber: formatNumber,
    formatMessage: formatMessage,
    formatHTMLMessage: formatHTMLMessage
  };

  for (var name in helpers) {
    if (helpers.hasOwnProperty(name)) {
      Nunjucks.addGlobal(name, helpers[name]);
    }
  } // intl custom tags are added through extension API


  Nunjucks.addExtension('intl', new intl()); // -- Helpers --------------------------------------------------------------

  function intl() {
    this.tags = ['intl'];

    this.parse = function (parser, nodes, lexer) {
      // get the tag token
      var tok = parser.nextToken(); // parse the args and move after the block end. passing true
      // as the second arg is required if there are no parentheses

      var args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value); // parse the body

      var body = parser.parseUntilBlocks('endintl');
      parser.advanceAfterBlockEnd(); // See above for notes about CallExtension

      return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function (context, options, body) {
      //console.log('context', context, 'context.lookup', context.lookup);
      //var frame = context.frame.push(),
      //    intlData = extend({}, context.lookup('intl'), options);
      //
      //frame.set('data.intl', intlData);
      return body();
    };
    /*
    if (!options.fn) {
        throw new Error('{{#intl}} must be invoked as a block helper');
    }
     // Create a new data frame linked the parent and create a new intl data
    // object and extend it with `options.data.intl` and `options.hash`.
    var data     = createFrame(options.data),
        intlData = extend({}, data.intl, options.hash);
     data.intl = intlData;
     return options.fn(this, {data: data});
    */

  }

  function intlGet(path) {
    var intlData = this.lookup('intl'),
        pathParts = path.split('.');
    var obj, len, i; // Use the path to walk the Intl data to find the object at the given
    // path, and throw a descriptive error if it's not found.

    try {
      for (i = 0, len = pathParts.length; i < len; i++) {
        obj = intlData = intlData[pathParts[i]];
      }
    } finally {
      if (obj === undefined) {
        throw new ReferenceError('Could not find Intl object: ' + path);
      }
    }

    return obj;
  }

  function formatDate(date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatDate}}');

    if (!options) {
      if (_typeof(format) === 'object') {
        options = format;
        format = null;
      } else {
        options = {};
      }
    }

    var locales = this.lookup('intl').locales;
    var formatOptions = getFormatOptions(this, 'date', format, options);
    return getDateTimeFormat(locales, formatOptions).format(date);
  }

  function formatTime(date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatTime}}');

    if (!options) {
      if (_typeof(format) === 'object') {
        options = format;
        format = null;
      } else {
        options = {};
      }
    }

    var locales = this.lookup('intl').locales;
    var formatOptions = getFormatOptions(this, 'time', format, options);
    return getDateTimeFormat(locales, formatOptions).format(date);
  }

  function formatRelative(date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatRelative}}');

    if (!options) {
      if (_typeof(format) === 'object') {
        options = format;
        format = null;
      } else {
        options = {};
      }
    }

    var locales = this.lookup('intl').locales;
    var formatOptions = getFormatOptions(this, 'relative', format, options);
    var now = options.now; // Remove `now` from the options passed to the `IntlRelativeFormat`
    // constructor, because it's only used when calling `format()`.

    delete formatOptions.now;
    return getRelativeFormat(locales, formatOptions).format(date, {
      now: now
    });
  }

  function formatNumber(num, format, options) {
    assertIsNumber(num, 'A number must be provided to {{formatNumber}}');

    if (!options) {
      if (_typeof(format) === 'object') {
        options = format;
        format = null;
      } else {
        options = {};
      }
    }

    var locales = this.lookup('intl').locales;
    var formatOptions = getFormatOptions(this, 'number', format, options);
    return getNumberFormat(locales, formatOptions).format(num);
  }

  function formatMessage(message, options) {
    if (!options) {
      if (_typeof(message) === 'object') {
        options = message;
        message = null;
      } else {
        options = {};
      }
    }

    if (!(message || typeof message === 'string' || options.intlName)) {
      throw new ReferenceError('{{formatMessage}} must be provided a message or intlName');
    }

    var intlData = this.lookup('intl') || {},
        locales = intlData.locales,
        formats = intlData.formats; // Lookup message by path name. User must supply the full path to the
    // message on `options.data.intl`.

    if (!message && options.intlName) {
      message = intlGet.call(this, options.intlName, options);
    } // When `message` is a function, assume it's an IntlMessageFormat
    // instance's `format()` method passed by reference, and call it. This
    // is possible because its `this` will be pre-bound to the instance.


    if (typeof message === 'function') {
      return message(options);
    }

    if (typeof message === 'string') {
      message = getMessageFormat(message, locales, formats);
    }

    return message.format(options);
  }

  function formatHTMLMessage(message, options) {
    if (!options) {
      if (_typeof(message) === 'object') {
        options = message;
        message = null;
      } else {
        options = {};
      }
    }

    var key, value; // Replace string properties in `options` with HTML-escaped strings.

    for (key in options) {
      if (options.hasOwnProperty(key)) {
        value = options[key]; // Escape string value.

        if (typeof value === 'string') {
          options[key] = this.env.filters.escape(value).val;
        }
      }
    }

    return this.env.filters.safe(formatMessage.call(this, message, options));
  } // -- Utilities ------------------------------------------------------------


  function assertIsDate(date, errMsg) {
    // Determine if the `date` is valid by checking if it is finite, which
    // is the same way that `Intl.DateTimeFormat#format()` checks.
    if (!isFinite(date)) {
      throw new TypeError(errMsg);
    }
  }

  function assertIsNumber(num, errMsg) {
    if (typeof num !== 'number') {
      throw new TypeError(errMsg);
    }
  }

  function getFormatOptions(self, type, format, options) {
    var formatOptions;

    if (format) {
      if (typeof format === 'string') {
        formatOptions = intlGet.call(self, 'formats.' + type + '.' + format, options);
      }

      formatOptions = (0, _utils.extend)({}, formatOptions, options);
    } else {
      formatOptions = options;
    }

    return formatOptions;
  }
}
//# sourceMappingURL=nunjucks-intl.js.map
