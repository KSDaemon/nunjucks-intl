/* global describe, it, expect, locale, Intl, IntlPolyfill, Nunjucks */
/* jshint node:true, expr:true */

'use strict';

var timeStamp = 1390518044403;

describe('Helper `formatNumber`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.globals).to.have.keys('formatNumber');
    });

    it('should be a function', function () {
        expect(Nunjucks.globals.formatNumber).to.be.a('function');
    });

    it('should throw if called with out a value'/*, function () {
        expect(Nunjucks.renderString('{{ formatNumber() }}')).to.throwException(function (e) {
            expect(e).to.be.a(Error);
        });
    }*/);

    describe('used to format numbers', function () {
        it('should return a string', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(4) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('4');
        });

        it('should return a decimal as a string', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(NUM)}}', { NUM: 4.004, intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('4.004');
        });

        it('should return a formatted string with a thousand separator', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(NUM) }}', {  NUM: 40000, intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('40,000');
        });

        it('should return a formatted string with a thousand separator and decimal', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000.004, intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('40,000.004');
        });

        describe('in another locale', function () {
            it('should return a string', function () {
                var tmpl = Nunjucks.renderString('{{ formatNumber(4) }}', { intl: { locales: 'de-DE' }});
                expect(tmpl).to.equal('4');
            });

            it('should return a decimal as a string', function () {
                var tmpl = Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 4.004, intl: { locales: 'de-DE' }});
                expect(tmpl).to.equal('4,004');
            });

            it('should return a formatted string with a thousand separator', function () {
                var tmpl = Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000, intl: { locales: 'de-DE' }});
                expect(tmpl).to.equal('40.000');
            });

            it('should return a formatted string with a thousand separator and decimal', function () {
                var tmpl = Nunjucks.renderString('{{ formatNumber(NUM) }}', { NUM: 40000.004, intl: { locales: 'de-DE' }});
                expect(tmpl).to.equal('40.000,004');
            });
        });
    });

    describe('used to format currency', function () {
        it('should return a string formatted to currency', function () {
            var tmpl;

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "USD" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('$40,000.00');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "EUR" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('€40,000.00');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "JPY" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('¥40,000');
        });

        it('should return a string formatted to currency with code', function () {
            var tmpl;

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "USD", currencyDisplay: "code" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('USD40,000.00');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "EUR", currencyDisplay: "code" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('EUR40,000.00');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: "JPY", currencyDisplay: "code" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('JPY40,000');
        });

        it('should function within an `for` tag', function () {
            var tmpl = Nunjucks.renderString('{% for item in currencies %} {{ formatNumber(item.AMOUNT, { style: "currency", currency: item.CURRENCY }) }}{% endfor %}',
                {
                    currencies: [
                        { AMOUNT: 3, CURRENCY: 'USD'},
                        { AMOUNT: 8, CURRENCY: 'EUR'},
                        { AMOUNT: 10, CURRENCY: 'JPY'}
                    ],
                    intl: { locales: 'en-US' }});
            // note the output must contain the correct spaces to match the template
            expect(tmpl).to.equal(' $3.00 €8.00 ¥10');
        });

        it('should return a currency even when using a different locale', function (){
            var tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: CURRENCY }) }}', { CURRENCY: 'USD', intl: { locales: 'de-DE' }});
            expect(tmpl, 'USD->de-DE').to.equal('40.000,00 $');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: CURRENCY }) }}', { CURRENCY: 'EUR', intl: { locales: 'de-DE' }});
            expect(tmpl, 'EUR->de-DE').to.equal('40.000,00 €');

            tmpl = Nunjucks.renderString('{{ formatNumber(40000, { style: "currency", currency: CURRENCY }) }}', { CURRENCY: 'JPY', intl: { locales: 'de-DE' }});
            expect(tmpl, 'JPY->de-DE').to.equal('40.000 ¥');
        });
    });

    describe('used to format percentages', function () {
        it('should return a string formatted to a percent', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(400, { style: "percent" }) }}', { intl: { locales: 'en-US' }});
            expect(tmpl).to.equal('40,000%');
        });

        it('should return a percentage when using a different locale', function () {
            var tmpl = Nunjucks.renderString('{{ formatNumber(400, { style: "percent" }) }}', { intl: { locales: 'de-DE' }});
            expect(tmpl).to.equal('40.000 %');
        });
    });
});

describe('Helper `formatDate`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.globals).to.have.keys('formatDate');
    });

    it('should be a function', function () {
        expect(Nunjucks.globals.formatDate).to.be.a('function');
    });

    it('should throw if called with out a value'/*, function () {
        expect(Nunjucks.renderString('{{ formatDate() }}')).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    }*/);

    // Use a fixed known date
    var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
        timeStamp = 1390518044403,
        fixedDate = new Date(1390518044403),
        fixedDateStr = "" + (fixedDate.getMonth()+1) + "/" + fixedDate.getDate() + "/" + fixedDate.getFullYear();

    it('should return a formatted string', function () {
        var intlData = {
            locales: 'en-US',
            formats: {
                date: {
                    short: {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric"
                    }
                }
            }
        };

        var tmpl = Nunjucks.renderString('{{ formatDate("' + dateStr + '") }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal(fixedDateStr);

        tmpl = Nunjucks.renderString('{{ formatDate("' + dateStr + '", "short") }}', { intl: intlData });
        expect(tmpl).to.equal(fixedDateStr);

        // note timestamp is passed as a number
        tmpl = Nunjucks.renderString('{{ formatDate(' + timeStamp + ') }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal(fixedDateStr);
    });

    it('should return a formatted string of just the time', function () {
        var intlData = {
            locales: 'en-US',
            formats: {
                date: {
                    usual: {
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "UTC"
                    }
                }
            }
        };

        var tmpl = Nunjucks.renderString('{{ formatDate(' + timeStamp + ', { hour: "numeric", minute: "numeric", timeZone: "UTC" }) }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('11:00 PM');

        tmpl = Nunjucks.renderString('{{ formatDate(' + timeStamp + ', "usual") }}', { intl: intlData });
        expect(tmpl).to.equal('11:00 PM');
    });

    it('should format the epoch timestamp', function () {
        var tmpl = Nunjucks.renderString('{{ formatDate(0) }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal(new Intl.DateTimeFormat('en').format(0));
    });
});

describe('Helper `formatTime`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.globals).to.have.keys('formatTime');
    });

    it('should be a function', function () {
        expect(Nunjucks.globals.formatTime).to.be.a('function');
    });

    it('should throw if called with out a value'/*, function () {
        expect(Nunjucks.renderString('{{ formatTime() }}')).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    }*/);

    // Use a fixed known date
    var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
        timeStamp = 1390518044403,
        fixedDate = new Date(1390518044403),
        fixedDateStr = "" + (fixedDate.getMonth()+1) + "/" + fixedDate.getDate() + "/" + fixedDate.getFullYear();

    it('should return a formatted string', function () {
        var tmpl = Nunjucks.renderString('{{ formatTime("' + dateStr + '") }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal(fixedDateStr);

        // note timestamp is passed as a number
        tmpl = Nunjucks.renderString('{{ formatTime(' + timeStamp + ') }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal(fixedDateStr);
    });

    it('should return a formatted string of just the time', function () {
        var intlData = {
            locales: 'en-US',
            formats: {
                time: {
                    usual: {
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "UTC"
                    }
                }
            }
        };

        var tmpl = Nunjucks.renderString('{{ formatTime(' + timeStamp + ', { hour: "numeric", minute: "numeric", timeZone: "UTC" }) }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('11:00 PM');

        tmpl = Nunjucks.renderString('{{ formatTime(' + timeStamp + ', "usual") }}', { intl: intlData });
        expect(tmpl).to.equal('11:00 PM');
    });
});

describe('Helper `formatRelative`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.globals).to.have.keys('formatRelative');
    });

    it('should be a function', function () {
        expect(Nunjucks.globals.formatRelative).to.be.a('function');
    });

    it('should throw if called with out a value'/*, function () {
        expect(Nunjucks.renderString('{{ formatRelative() }}')).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    }*/);

    var tomorrow = new Date().getTime() + (24 * 60 * 60 * 1000);

    it('should return a formatted string', function () {
        var tmpl = Nunjucks.renderString('{{ formatRelative(date) }}', { date: tomorrow, intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('tomorrow');
    });

    it('should accept formatting options', function () {
        var tmpl = Nunjucks.renderString('{{ formatRelative(date, { style: "numeric" }) }}', { date: tomorrow, intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('in 1 day');
    });

    it('should accept a `now` option', function () {
        var tmpl = Nunjucks.renderString('{{ formatRelative(2000, { now: 1000 }) }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('in 1 second');
    });

    it('should format the epoch timestamp', function () {
        var tmpl = Nunjucks.renderString('{{ formatRelative(0, { now: 1000 }) }}', { intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('1 second ago');
    });
});

describe('Helper `formatMessage`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.globals).to.have.keys('formatMessage');
    });

    it('should be a function', function () {
        expect(Nunjucks.globals.formatMessage).to.be.a('function');
    });

    it('should throw if called with out a value'/*, function () {
        expect(Nunjucks.renderString('{{ formatMessage() }}')).to.throwException(function (e) {
            expect(e).to.be.a(ReferenceError);
        });
    }*/);

    it('should return a formatted string', function () {
        var tmpl = Nunjucks.renderString('{{ formatMessage(MSG, { firstName: firstName, lastName: lastName }) }}',
            {
                MSG      : 'Hi, my name is {firstName} {lastName}.',
                firstName: 'Anthony',
                lastName : 'Pipkin',
                intl: { locales: 'en-US' }
            });
        expect(tmpl).to.equal('Hi, my name is Anthony Pipkin.');
    });

    it('should return a formatted string with formatted numbers and dates', function () {
        var tmpl = Nunjucks.renderString('{{ formatMessage(POP_MSG, { city: city, population: population, census_date: census_date, timeZone: timeZone }) }}',
            {
                POP_MSG    : '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
                city       : 'Atlanta',
                population : 5475213,
                census_date: (new Date('1/1/2010')).getTime(),
                timeZone   : 'UTC',
                intl: { locales: 'en-US' }});
        expect(tmpl).to.equal('Atlanta has a population of 5,475,213 as of January 1, 2010.');
    });

    it('should return a formatted string with formatted numbers and dates in a different locale', function () {
        var tmpl = Nunjucks.renderString('{{ formatMessage(POP_MSG, { city: city, population: population, census_date: census_date, timeZone: timeZone }) }}',
            {
                POP_MSG    : '{city} hat eine Bevölkerung von {population, number, integer} zum {census_date, date, long}.',
                city       : 'Atlanta',
                population : 5475213,
                census_date: (new Date('1/1/2010')),
                timeZone   : 'UTC',
                intl: { locales: 'de-DE' }
            });
        expect(tmpl).to.equal('Atlanta hat eine Bevölkerung von 5.475.213 zum 1. Januar 2010.');
    });

    it('should return a formatted string within an `for` tag', function () {
        var tmpl = Nunjucks.renderString('{% for item in harvest %} {{ formatMessage(HARVEST_MSG, { person: item.person, count: item.count }) }}{% endfor %}',
            {
                HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.',
                harvest    : [
                    { person: 'Allison', count: 10 },
                    { person: 'Jeremy', count: 60 }
                ],
                intl: { locales: 'en-US' }
            });
        expect(tmpl).to.equal(' Allison harvested 10 apples. Jeremy harvested 60 apples.');
    });

    it('should return a formatted `selectedordinal` message', function () {
        var tmpl = Nunjucks.renderString('{{ formatMessage(BDAY_MSG, { year: year }) }}',
            {
                BDAY_MSG: 'This is my {year, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} birthday.',
                year    : 3,
                intl: { locales: 'en-US' }
            });
        expect(tmpl).to.equal('This is my 3rd birthday.');
    });
});

/*
describe('Tag `intl`', function () {
    it('should be added to Nunjucks', function () {
        expect(Nunjucks.extensions).to.have.keys('intl');
    });

    it('should be an object', function () {
        expect(Nunjucks.extensions.intl).to.be.a('object');
    });

    describe('should provide formats', function () {
        it('for formatNumber', function () {
            var tmpl = '{{#intl formats=intl.formats locales="en-US"}}{{formatNumber NUM "usd"}} {{formatNumber NUM "eur"}} {{formatNumber NUM style="currency" currency="USD"}}{{/intl}}',
                ctx = {
                    intl: {
                        formats: {
                            number: {
                                eur: { style: 'currency', currency: 'EUR' },
                                usd: { style: 'currency', currency: 'USD' }
                            }
                        }
                    },
                    NUM: 40000.004
                };
            expect(Nunjucks.renderString(tmpl)(ctx)).to.equal('$40,000.00 €40,000.00 $40,000.00');
        });

        it('for formatDate', function () {
            var tmpl = '{{#intl formats=intl.formats locales="en-US"}}{{formatDate ' + timeStamp + ' "hm" timeZone="UTC"}}{{/intl}}',
                ctx = {
                    intl: {
                        formats: {
                            date: {
                                hm: { hour: 'numeric', minute: 'numeric' }
                            }
                        }
                    }
                },
                d = new Date(timeStamp);
            expect(Nunjucks.renderString(tmpl)(ctx)).to.equal("11:00 PM");
        });

        it('for formatMessage', function () {
            var tmpl = '{{#intl formats=intl.formats locales="en-US"}}{{formatMessage MSG product=PRODUCT price=PRICE deadline=DEADLINE timeZone=TZ}}{{/intl}}',
                ctx = {
                    MSG: '{product} cost {price, number, usd} (or {price, number, eur}) if ordered by {deadline, date, long}',
                    intl: {
                        formats: {
                            number: {
                                eur: { style: 'currency', currency: 'EUR' },
                                usd: { style: 'currency', currency: 'USD' }
                            }
                        }
                    },
                    PRODUCT: 'oranges',
                    PRICE: 40000.004,
                    DEADLINE: timeStamp,
                    TZ: 'UTC'
                },
                fixedDate = new Date(timeStamp),
                fixedDateStr = "" + fixedDate.getDate() + ", " + fixedDate.getFullYear();

            expect(Nunjucks.renderString(tmpl)(ctx)).to.equal("oranges cost $40,000.00 (or €40,000.00) if ordered by January " + fixedDateStr);
        });
    });
});
*/
