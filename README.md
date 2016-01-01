[Nunjucks Intl][]
===================

This library provides [Nunjucks][] helpers for internationalization. The helpers provide a declarative way to format dates, numbers, and string messages with pluralization support.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]

[![Sauce Test Status][sauce-badge]][sauce]

**This package used to be named `nunjucks-helper-intl`.**


Overview
--------

**Nunjucks Intl is part of [FormatJS][], the docs can be found on the webiste:**
**<http://formatjs.io/nunjucks/>**

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 200+ languages.
- Runs in the browser and Node.js.
- Built on standards.

### Example

There are many examples [on the website][Nunjucks Intl], but here's a comprehensive one:

```nunjucks
{{formatMessage (intlGet "messages.post.meta")
    num=post.comments.length
    ago=(formatRelative post.date)}}
```

```js
var context = {
    post: {
        date    : 1422046290531,
        comments: [/*...*/]
    }
};

var intlData = {
    locales : ['en-US'],
    messages: {
        post: {
            meta: 'Posted {ago}, {num, plural, one{# comment} other{# comments}}'
        }
    }
};

var template = Nunjucks.compile(/* Template source above */);

var html = template(context, {
    data: {intl: intlData}
});
```

This example would render: **"Posted 3 days ago, 1,000 comments"** to the `html` variable. The `post.meta` message is written in the industry standard [ICU Message syntax][], which you can also learn about on the [FormatJS website][FormatJS].


Contribute
----------

Let's make Nunjucks Intl and FormatJS better! If you're interested in helping, all contributions are welcome and appreciated. Nunjucks Intl is just one of many packages that make up the [FormatJS suite of packages][FormatJS GitHub], and you can contribute to any/all of them, including the [Format JS website][FormatJS] itself.


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][LICENSE] for license text and copyright information.


[Nunjucks Intl]: http://formatjs.io/nunjucks/
[Nunjucks]: http://mozilla.github.io/nunjucks
[npm]: https://www.npmjs.org/package/nunjucks-intl
[npm-badge]: https://img.shields.io/npm/v/nunjucks-intl.svg?style=flat-square
[travis]: https://travis-ci.org/KSDaemon/nunjucks-intl
[travis-badge]: http://img.shields.io/travis/KSDaemon/nunjucks-intl.svg?style=flat-square
[david]: https://david-dm.org/KSDaemon/nunjucks-intl
[david-badge]: https://img.shields.io/david/KSDaemon/nunjucks-intl.svg?style=flat-square
[sauce]: https://saucelabs.com/u/nunjucks-intl
[sauce-badge]: https://saucelabs.com/browser-matrix/nunjucks-intl.svg
[FormatJS]: http://formatjs.io/
[FormatJS GitHub]: http://formatjs.io/github/
[ICU Message syntax]: http://formatjs.io/guide/#messageformat-syntax
[LICENSE]: https://github.com/KSDaemon/nunjucks-intl/blob/master/LICENSE
