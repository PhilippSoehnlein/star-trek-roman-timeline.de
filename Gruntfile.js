/* jshint node:true */
module.exports = function(grunt) {
    'use strict';

    var ejsHelpers = require( './src/js/ejs-helpers.js' );

    grunt.initConfig({
        watch: {
            files: [
                'Gruntfile.js',
                'src/books.json',
                'src/books/**/*.json',
                'src/templates/*.ejs',
                'src/scss/**/*.scss',
                'src/js/**.js',
                'src/img/**',
            ],
            tasks: [ 'build' ]
        },

        render: {
            options: {
                helpers: ejsHelpers,
            },
            index: {
                options: {
                    data: [ 'src/books/live/*.json' ],
                },
                files: {
                    'build/index.html': [ 'src/templates/index.ejs' ]
                }
            },
            'index-test': {
                options: {
                    data: [ 'src/books/test/*.json' ],
                },
                files: {
                    'build/index.html': [ 'src/templates/index.ejs' ]
                }
            },
            imprint: {
                files: {
                    'build/impressum.html': [ 'src/templates/imprint.ejs' ]
                }
            }
        },

        connect: {
            dev: {
                // the DEV server
                options: {
                    port:      8000,
                    base:      'build',
                    keepalive: false,
                },
            },
            serve: {
                // the DEV server
                options: {
                    port:      8000,
                    base:      'build',
                    keepalive: true,
                    debug:     true,
                },
            },
            'test-e2e': {
                // the server used in e2e tests
                options: {
                    port:      8001,
                    base:      'build',
                },
            },
        },

        sass: {
            build: {
                files: {
                    'build/main.css': 'src/scss/main.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            main: {
                src: 'build/main.css',
                dest: 'build/main.css'
            },
        },

        imageEmbed: {
            build: {
                src: [ 'build/main.css' ],
                dest: 'build/main.css',
                options: {
                    baseDir: '../src/',
                }
            },
        },

        uglify: {
            main: {
                options: {
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'build/main.map'
                },
                files: {
                    'build/main.js': [
                        // not using minified version here, to have a proper sourceMap
                        'bower_components/isotope/dist/isotope.pkgd.js',

                        'src/js/filter.js'
                    ]
                }
            },
        },

        htmlmin: {
            options: {
                removeComments:     true,
                collapseWhitespace: true
            },
            index: {
                files: {
                    'build/index.html':     'build/index.html',
                }
            },
            imprint: {
                files: {
                    'build/impressum.html': 'build/impressum.html',
                }
            },
        },

        copy: {
            build: {
                files: [
                    {              src: 'src/docroot/favicon.ico',                      dest: 'build/favicon.ico' },
                    //{              src: 'src/docroot/apple-touch-icon-precomposed.png', dest: 'build/apple-touch-icon-precomposed.png' }, // jshint ignore:line
                    {              src: 'src/docroot/robots.txt',                       dest: 'build/robots.txt' },
                    {              src: 'src/docroot/humans.txt',                       dest: 'build/humans.txt' },
                    {              src: 'src/docroot/.htaccess',                        dest: 'build/.htaccess' },
                    {              src: 'src/img/kaemira-nebula640.jpg',                dest: 'build/img/kaemira-nebula640.jpg' }, // jshint ignore:line
                    {              src: 'src/img/kaemira-nebula1280.jpg',               dest: 'build/img/kaemira-nebula1280.jpg' }, // jshint ignore:line
                    {              src: 'src/img/kaemira-nebula1920.jpg',               dest: 'build/img/kaemira-nebula1920.jpg' }, // jshint ignore:line
                    { cwd: 'src/', src: 'img/book-covers/**',                           dest: 'build/', expand: true,  }, // jshint ignore:line
                    {              src: 'src/img/book-covers/.htaccess',                dest: 'build/img/book-covers/.htaccess' }, // jshint ignore:line
                ]
            }
        },

        clean: {
            beforeBuild: ['build'],
        },

        protractor: {
            // TODO: Find a way to add IE here somehow
            chrome: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'chrome',
                        specs: [ 'test/e2e/**.js' ],
                    }
                },
            },
            firefox: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'firefox',
                        specs: [ 'test/e2e/**.js' ],
                    }
                },
            },
            safari: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'safari',
                        specs: [ 'test/e2e/**.js' ],
                    }
                },
            },
            iphone: {
                configFile: 'test/e2e/etc/protractor-iphone.js',
                options: {
                    args: {
                        specs: [ 'test/e2e/**.js' ],
                    }
                }
            }
        },

        jasmine_node: {  // jshint ignore:line
            options: {
                matchall: true, // true = test file doesn't need to have "spec" in the filename.
            },
            all: ['test/spec/']
        },
    });

    grunt.loadNpmTasks('grunt-ejs-render');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-image-embed');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-jasmine-node');


    grunt.registerTask('dev', 'Makes a build, starts a local DEV server at localhost:8000 and runs the watch task.', [
        'build',
        'connect:dev',
        'watch',
    ]);

    grunt.registerTask('build', 'Builds the site and puts it into the build/ folder.', [
        // TODO: Add CSS minifier
        'clean:beforeBuild',
        'copy:build',
        'render:index',
        'htmlmin:index',
        'render:imprint',
        'htmlmin:imprint',
        'sass',
        'imageEmbed',
        'autoprefixer',
        'uglify',
    ]);

    grunt.registerTask('build:test', 'Builds the site with test data and puts it into the build/ folder.', [
        // Same as build, but with render:index-test instead of render:index
        'clean:beforeBuild',
        'copy:build',
        'render:index-test',
        'render:imprint',
        'htmlmin:imprint',
        'sass',
        'imageEmbed',
        'autoprefixer',
        'uglify'
    ]);

    grunt.registerTask('serve', 'Build the suite and serves it on localhost:8000', [
        'build',
        'connect:serve',
    ]);

    grunt.registerTask('test-e2e', 'Executes end-to-end tests for all configured browsers.', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
        'protractor:chrome',
        'protractor:safari',
        'protractor:iphone',
    ]);

    grunt.registerTask('test-e2e:firefox', 'Executes end-to-end tests in Firefox.', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
    ]);

    grunt.registerTask('test-e2e:chrome', 'Executes end-to-end tests in Chrome.', [
        'build:test',
        'connect:test-e2e',
        'protractor:chrome',
    ]);

    grunt.registerTask('test-e2e:safari', 'Executes end-to-end tests in Safari.', [
        'build:test',
        'connect:test-e2e',
        'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:desktop-browser', 'Executes end-to-end tests for all configured desktop browsers.', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
        'protractor:chrome',
        'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:iphone', 'Executes end-to-end tests in a simulated iPhone.', [
        // TODO: appium has to run for this to work (node_modules/appium/bin/appium.js). Check how we can automate this.
        'build:test',
        'connect:test-e2e',
        'protractor:iphone',
    ]);

    grunt.registerTask('test:unit', 'Executes unit tests.', [
        'jasmine_node',
    ]);
};
