"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
// -----------------------------------------------------------------------------
function extend(obj) {
  var sources = Array.prototype.slice.call(arguments, 1),
      i,
      len,
      source,
      key;

  for (i = 0, len = sources.length; i < len; i += 1) {
    source = sources[i];

    if (!source) {
      continue;
    }

    for (key in source) {
      if (source.hasOwnProperty(key)) {
        obj[key] = source[key];
      }
    }
  }

  return obj;
}
//# sourceMappingURL=utils.js.map
