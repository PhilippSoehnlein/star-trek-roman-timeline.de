/**
 * Available tasks:
 *     - build:                    Builds the site and puts it into the build/ folder.
 *     - dev:                      Makes a build, starts a local DEV server at localhost:8000 and runs the watch task.
 *     - test-e2e:                 Executes end-to-end tests for all configured browsers.
 *     - test-e2e:desktop-browser: Executes end-to-end tests for all configured desktop browsers.
 *     - test-e2e:chrome:          Executes end-to-end tests in Chrome.
 *     - test-e2e:firefox:         Executes end-to-end tests in Firefox.
 *     - test-e2e:safari:          Executes end-to-end tests in Safari.
 *     - test-e2e:iphone:          Executes end-to-end tests in a simulated iPhone.
 *     - test:unit:                Executes unit tests.
 */
module.exports = function(grunt) {
    var ejsHelpers = require('./src/js/ejs-helpers.js');

    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: [ 'Gruntfile.js', 'src/books.json', 'src/templates/*.ejs', 'src/scss/**/*.scss', 'src/js/**.js' ],
            tasks: [ 'build' ]
        },

        render: {
            options: {
                helpers: ejsHelpers,
            },
            index: {
                options: {
                    data: [ 'src/books.json' ],
                },
                files: {
                    'build/index.html': [ 'src/templates/index.ejs' ]
                }
            },
            'index-test': {
                options: {
                    data: [ 'src/books-test.json' ],
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
                    keepalive: false, // don't ever exit the server
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
            single_file: {
                src: 'build/main.css',
                dest: 'build/main.css'
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
                        'bower_components/isotope/dist/isotope.pkgd.js', // not using minified version here, to have a proper sourceMap
                        'src/js/filter.js'
                    ]
                }
            },
        },

        copy: {
            build: {
                files: [
                    { src: 'src/docroot/favicon.ico',                      dest: 'build/favicon.ico' },
                    { src: 'src/docroot/apple-touch-icon-precomposed.png', dest: 'build/apple-touch-icon-precomposed.png' },
                    { src: 'src/docroot/robots.txt',                       dest: 'build/robots.txt' },
                    { src: 'src/docroot/humans.txt',                       dest: 'build/humans.txt' },
                    { src: 'src/docroot/.htaccess',                        dest: 'build/.htaccess' },
                    { src: 'src/img/kaemira-nebula640.jpg',                dest: 'build/img/kaemira-nebula640.jpg' },
                    { src: 'src/img/kaemira-nebula1280.jpg',               dest: 'build/img/kaemira-nebula1280.jpg' },
                    { src: 'src/img/kaemira-nebula1920.jpg',               dest: 'build/img/kaemira-nebula1920.jpg' }
                ]
            }
        },

        clean: {
            beforeBuild: ['build'],
        },

        protractor: {
            chrome: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'chrome',
                        specs: ['test/e2e/filter.js'],
                    }
                },
            },
            firefox: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'firefox',
                        specs: ['test/e2e/filter.js'],
                    }
                },
            },
            safari: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'safari',
                        specs: ['test/e2e/filter.js'],
                    }
                },
            },
            iphone: {
                configFile: 'test/e2e/etc/protractor-iphone.js',
                options: {
                    args: {
                        specs: ['test/e2e/filter.js'],
                    }
                }
            }
        },

        jasmine_node: {
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('dev', [
        'build',
        'connect:dev',
        'watch',
    ]);

    grunt.registerTask('build', [
        'clean:beforeBuild',
        'copy:build',
        'render:index',
        'render:imprint',
        'sass',
        'uglify',
        'autoprefixer'
    ]);

    grunt.registerTask('build:test', [
        // Same as build, but with render:index-test instead of render:index
        'clean:beforeBuild',
        'copy:build',
        'render:index-test',
        'render:imprint',
        'sass',
        'uglify',
        'autoprefixer'
    ]);

    grunt.registerTask('test-e2e', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
        'protractor:chrome',
        'protractor:safari',
        'protractor:iphone',
    ]);

    grunt.registerTask('test-e2e:firefox', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
    ]);

    grunt.registerTask('test-e2e:chrome', [
        'build:test',
        'connect:test-e2e',
        'protractor:chrome',
    ]);

    grunt.registerTask('test-e2e:safari', [
        'build:test',
        'connect:test-e2e',
        'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:desktop-browser', [
        'build:test',
        'connect:test-e2e',
        'protractor:firefox',
        'protractor:chrome',
        'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:iphone', [
        // TODO: appium has to run for this to work (node_modules/appium/bin/appium.js). Check how we can automate this.
        'build:test',
        'connect:test-e2e',
        'protractor:iphone',
    ]);

    grunt.registerTask('test:unit', [
        'jasmine_node',
    ]);
}
