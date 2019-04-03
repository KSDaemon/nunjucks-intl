Nunjucks Intl
=============

This library provides [Nunjucks][] helpers for internationalization. The helpers provide a declarative way
to format dates, numbers, and string messages with pluralization support.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

Overview
--------

Nunjucks Intl uses [FormatJS][] components under the hood, the docs can be found on the webiste:
<http://formatjs.io/>

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 200+ languages.
- Runs in the browser and Node.js.
- Built on standards.

### Quick example

```nunjucks
{{ formatMessage(
    intlGet("messages.post.meta"),
    {
        num: post.comments.length,
        ago: formatRelative(post.date)
    })
}}
```

```js
var data = {
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

data.intl = intlData;

var html = nunjucks.renderString(/* Template source above */, data);
```

This example would render: **"Posted 3 days ago, 1,000 comments"** to the `html` variable.
The `post.meta` message is written in the industry standard [ICU Message syntax][], which you can
also learn about on the [FormatJS website][FormatJS].

In all examples below, for simplicity, nunjucks.renderString is used, but, of course,
template render() works the same way.

### API Methods

#### Registering Nunjucks Intl with Nunjucks instance

To start using intl helpers in your template, first of all, you need to register helpers with your instance of
Nunjucks enviroment.

This is done by:

```javascript
const nunjucks = require('nunjucks');
const env = nunjucks.configure();

const nunjucksIntl = require('nunjucks-intl');

nunjucksIntl.registerWith(env);

```

This adds a few global functions to nunjucks enviroment, so you can use them in your templates. Nunjucks Intl
helpers expect to find `intl` hash-map in template context data. More info below.

#### intlGet helper

This helper implements a lookup process by path to access data from the intl object passed into the Nunjucks data
context when rendering the template. Usually this helper is used in a subexpressions to lookup
translated string messages;

```javascript
Nunjucks.renderString('{{ formatMessage(intlGet("MSG"), { firstName: firstName, lastName: lastName }) }}',
    {
        firstName: 'Vasiliy',
        lastName : 'Pupkin',
        intl: {
            MSG : 'Hi, my name is {firstName} {lastName}.',
            locales: 'en-US'
        }
    })
// output: Hi, my name is Vasiliy Pupkin.
```

#### formatNumber helper

This helper is used to format numbers, including currencies and percentages.

```javascript
Nunjucks.renderString('{{ formatNumber(NUM)}}', { NUM: 4.004, intl: { locales: 'en-US' }})
// output: 4.004

Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 4.004, intl: { locales: 'de-DE' }})
// output: 4,004

Nunjucks.renderString('{{ formatNumber(NUM) }}', {  NUM: 40000, intl: { locales: 'en-US' }})
// output: 40,000

Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000, intl: { locales: 'de-DE' }})
// output: 40.000

Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000.004, intl: { locales: 'en-US' }})
// output: 40,000.004

Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000.004, intl: { locales: 'de-DE' }})
// output: 40.000,004

Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "USD" }) }}', { intl: { locales: 'en-US' }})
// output: $40,000.00

Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "EUR", currencyDisplay: "code" }) }}', { intl: { locales: 'en-US' }})
// output: EUR40,000.00

// also it's possible to return a currency even when using a different locale
Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: CURRENCY }) }}', { CURRENCY: 'JPY', intl: { locales: 'de-DE' }})
// output: 40.000 ¥

Nunjucks.renderString('{{ formatNumber(0.45, { style: "percent" }) }}', { intl: { locales: 'en-US' }})
// output: 45%

```

#### formatDate/formatTime helpers

This helpers are used to format dates, including time. You can pass a date string or timestamp.
formatDate and formatTime works the same way, and the only difference is the place for searching custom formats.
formatDate search them in formats.date, and formatTime - in formats.time respectively.
In example below, custom format is used, read more on [FormatJS][] site.

```javascript
var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)';
var timeStamp = 1390518044403; //same as dateStr
var intlData = {
    locales: 'en-US',
    formats: {
        date: {
            short: {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }
        },
        usual: {
            hour: "numeric",
            minute: "numeric",
            timeZone: "UTC"
        }
    }
};

Nunjucks.renderString('{{ formatDate("' + dateStr + '") }}', { intl: { locales: 'en-US' }});
// output: 1/24/2014

//The same output using custom format
Nunjucks.renderString('{{ formatDate("' + dateStr + '", "short") }}', { intl: intlData });
// output: 1/24/2014

//timestamp is passed as a number
Nunjucks.renderString('{{ formatDate(' + timeStamp + ') }}', { intl: { locales: 'en-US' }});
// output: 1/24/2014

Nunjucks.renderString('{{ formatDate(' + timeStamp + ', "usual") }}', { intl: intlData });
// output: 11:00 PM

```

#### formatRelative helper

This helper is used to format relative date and time.

```javascript
var tomorrow = new Date().getTime() + (24 * 60 * 60 * 1000);

Nunjucks.renderString('{{ formatRelative(date) }}', { date: tomorrow, intl: { locales: 'en-US' }});
// output: tomorrow

Nunjucks.renderString('{{ formatRelative(date, { style: "numeric" }) }}', { date: tomorrow, intl: { locales: 'en-US' }})
// output: in 1 day

// also it's possible to set NOW
Nunjucks.renderString('{{ formatRelative(2000, { now: 1000 }) }}', { intl: { locales: 'en-US' }});
// output: in 1 second

Nunjucks.renderString('{{ formatRelative(0, { now: 1000 }) }}', { intl: { locales: 'en-US' }});
// output: 1 second ago
```

#### formatMessage/formatHTMLMessage helpers

This helpers are used to format internationalization messages, including dates, numbers, and pluralization cases.
Using formatHTMLMessage, you can pass messages with html entities, and they will not be escaped.
User data is always escaped.

```javascript
Nunjucks.renderString('{{ formatMessage({ firstName: firstName, lastName: lastName, intlName: "MSG" }) }}',
    {
        firstName: 'Vasiliy',
        lastName : 'Pupkin',
        intl: {
            MSG      : 'Hi, my name is {firstName} {lastName}.',
            locales: 'en-US'
        }
    });
// output: Hi, my name is Vasiliy Pupkin.

Nunjucks.renderString('{{ formatMessage(POP_MSG, { city: city, population: population, census_date: census_date, timeZone: timeZone }) }}',
    {
        POP_MSG    : '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
        city       : 'Atlanta',
        population : 5475213,
        census_date: (new Date('1/1/2010')).getTime(),
        timeZone   : 'UTC',
        intl: { locales: 'en-US' }
    });
// output: Atlanta has a population of 5,475,213 as of January 1, 2010.

Nunjucks.renderString('{{ formatMessage(BDAY_MSG, { year: year }) }}',
    {
        BDAY_MSG: 'This is my {year, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} birthday.',
        year    : 3,
        intl: { locales: 'en-US' }
    });
// output: This is my 3rd birthday.


Nunjucks.renderString('{{ formatHTMLMessage(intlGet("MSG"), { firstName: firstName, lastName: lastName }) }}',
    {
        firstName: '<Vasiliy>',
        lastName : '<Pupkin>',
        intl: {
            MSG : 'Hi, my <name> is {firstName} {lastName}.',
            locales: 'en-US'
        }
    });
// output: Hi, my <name> is &lt;Vasiliy&gt; &lt;Pupkin&gt;.
```

Also, you can lookup into [tests](tests/helpers.js) for more usage examples.

Contribute
----------

Let's make Nunjucks Intl and FormatJS better! If you're interested in helping, all contributions
are welcome and appreciated. Nunjucks Intl is just one of many packages that make up the
[FormatJS suite of packages][FormatJS GitHub], and you can contribute to any/all of them,
including the [Format JS website][FormatJS] itself.


License
-------

This software is free to use under the BSD license.
See the [LICENSE file][LICENSE] for license text and copyright information.


[Nunjucks]: http://mozilla.github.io/nunjucks
[npm]: https://www.npmjs.org/package/nunjucks-intl
[npm-badge]: https://img.shields.io/npm/v/nunjucks-intl.svg?style=flat-square
[travis]: https://travis-ci.org/KSDaemon/nunjucks-intl
[travis-badge]: http://img.shields.io/travis/KSDaemon/nunjucks-intl.svg?style=flat-square
[david]: https://david-dm.org/KSDaemon/nunjucks-intl
[david-badge]: https://img.shields.io/david/KSDaemon/nunjucks-intl.svg?style=flat-square
[greenkeeper-image]: https://badges.greenkeeper.io/KSDaemon/nunjucks-intl.svg
[greenkeeper-url]: https://greenkeeper.io/
[FormatJS]: http://formatjs.io/
[FormatJS GitHub]: http://formatjs.io/github/
[ICU Message syntax]: http://formatjs.io/guide/#messageformat-syntax
[LICENSE]: https://github.com/KSDaemon/nunjucks-intl/blob/master/LICENSE
