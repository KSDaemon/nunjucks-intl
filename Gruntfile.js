'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            dist: 'dist/',
            lib : 'lib/',
            tmp : 'tmp/'
        },

        copy: {
            tmp: {
                expand: true,
                cwd   : 'tmp/src/',
                src   : '**/*.js',
                dest  : 'lib/'
            }
        },

        concat: {
            dist_with_locales: {
                src: ['dist/nunjucks-intl.js', 'dist/locale-data/*.js'],
                dest: 'dist/nunjucks-intl-with-locales.js',

                options: {
                    sourceMap: true
                }
            }
        },

        jshint: {
            all: ['index.js', 'src/*.js', '!src/en.js', 'tests/*.js']
        },

        benchmark: {
            all: {
                src: ['tests/benchmark/*.js']
            }
        },

        extract_cldr_data: {
            options: {
                pluralRules   : true,
                relativeFields: true
            },

            src_en: {
                dest: 'src/en.js',

                options: {
                    locales: ['en'],
                    prelude: '// GENERATED FILE\n',

                    wrapEntry: function (entry) {
                        return 'export default ' + entry + ';';
                    }
                }
            },

            lib_all: {
                dest: 'lib/locales.js',

                options: {
                    prelude: [
                        '// GENERATED FILE',
                        'var NunjucksIntl = require("./nunjucks-intl");\n\n'
                    ].join('\n'),

                    wrapEntry: function (entry) {
                        return 'NunjucksIntl.__addLocaleData(' + entry + ');';
                    }
                }
            },

            dist_all: {
                dest: 'dist/locale-data/',

                options: {
                    wrapEntry: function (entry) {
                        return 'NunjucksIntl.__addLocaleData(' + entry + ');';
                    }
                }
            }
        },

        bundle_jsnext: {
            dest: 'dist/nunjucks-intl.js',

            options: {
                namespace : 'NunjucksIntl',
                sourceRoot: 'nunjucks-intl/'
            }
        },

        cjs_jsnext: {
            dest: 'tmp/'
        },

        uglify: {
            options: {
                //console: false,
                preserveComments       : 'some',
                sourceMap              : true,
                sourceMapRoot          : 'nunjucks-intl/',
                sourceMapIncludeSources: true
            },

            dist: {
                options: {
                    sourceMapIn: 'dist/nunjucks-intl.js.map'
                },

                files: {
                    'dist/nunjucks-intl.min.js': [
                        'dist/nunjucks-intl.js'
                    ]
                }
            },

            dist_with_locales: {
                options: {
                    sourceMapIn: 'dist/nunjucks-intl-with-locales.js.map'
                },

                files: {
                    'dist/nunjucks-intl-with-locales.min.js': [
                        'dist/nunjucks-intl-with-locales.js'
                    ]
                }
            }
        },

        json_remove_fields: {
            min_source_maps: {
                options: {
                    fields: ['sourceRoot']
                },

                src: 'dist/*.min.js.map'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-benchmark');
    grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
    grunt.loadNpmTasks('grunt-extract-cldr-data');
    grunt.loadNpmTasks('grunt-json-remove-fields');

    grunt.registerTask('cldr', ['extract_cldr_data']);

    grunt.registerTask('compile', [
        'jshint',
        'bundle_jsnext',
        'concat:dist_with_locales',
        'uglify',
        'json_remove_fields',
        'cjs_jsnext',
        'copy:tmp'
    ]);

    grunt.registerTask('default', [
        'clean',
        'cldr',
        'compile'
    ]);
};
