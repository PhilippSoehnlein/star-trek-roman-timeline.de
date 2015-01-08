/**
 * Available tasks:
 *     - build:                    Builds the site and puts it into the build/ folder.
 *     - dev:                      Makes a build, starts a local DEV server at localhost:8000 and runs the watch task.
 *     - test-e2e:                 Executes end-to-end tests for all configured browsers.
 *     - test-e2e:desktop-browser: Executes end-to-end tests for all configured desktop browsers.
 *     - test-e2e:chrome:          Executes end-to-end tests in Chrome.
 *     - test-e2e:firefox:         Executes end-to-end tests in Firefox.
 *     - test-e2e:iphone:          Executes end-to-end tests in a simulated iPhone.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['src/index.html', 'src/main.scss', 'src/scss/**/*.scss'],
            tasks: ['build']
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
                    'build/main.css': 'src/main.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                opbrowsers: ['last 2 version']
            },
            single_file: {
                src: 'build/main.css',
                dest: 'build/main.css'
            },
        },

        copy: {
            build: {
                files: [
                    { src: 'src/favicon.ico',                      dest: 'build/favicon.ico' },
                    { src: 'src/apple-touch-icon-precomposed.png', dest: 'build/apple-touch-icon-precomposed.png' },
                    { src: 'src/robots.txt',                       dest: 'build/robots.txt' },
                    { src: 'src/humans.txt',                       dest: 'build/humans.txt' },
                    { src: 'src/.htaccess',                        dest: 'build/.htaccess' },
                    { src: 'src/img/kaemira-nebula640.jpg',        dest: 'build/img/kaemira-nebula640.jpg' },
                    { src: 'src/img/kaemira-nebula1280.jpg',       dest: 'build/img/kaemira-nebula1280.jpg' },
                    { src: 'src/img/kaemira-nebula1920.jpg',       dest: 'build/img/kaemira-nebula1920.jpg' }
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
                        specs: ['test/e2e/basic.js'],
                    }
                },
            },
            firefox: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'firefox',
                        specs: ['test/e2e/basic.js'],
                    }
                },
            },
            safari: {
                configFile: 'test/e2e/etc/protractor-desktop-browser.js',
                options: {
                    args: {
                        browser: 'safari',
                        specs: ['test/e2e/basic.js'],
                    }
                },
            },
            iphone: {
                configFile: 'test/e2e/etc/protractor-iphone.js',
                options: {
                    args: {
                        specs: ['test/e2e/basic.js'],
                    }
                }
            }
        },

        forever: {
            appium: {
                options: {
                    index: 'node_modules/appium/bin/appium.js',
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-ejs-render');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.registerTask('dev', [
        'build',
        'connect:dev',
        'watch',
    ]);

    grunt.registerTask('build', [
        'clean:beforeBuild',
        'copy:build',
        'render',
        'sass',
        'autoprefixer'
    ]);

    grunt.registerTask('test-e2e', [
        'connect:test-e2e',
        'protractor:firefox',
        'protractor:chrome',
        'protractor:iphone',
    ]);

    grunt.registerTask('test-e2e:firefox', [
         'connect:test-e2e',
         'protractor:firefox',
    ]);

    grunt.registerTask('test-e2e:chrome', [
         'connect:test-e2e',
         'protractor:chrome',
    ]);

    grunt.registerTask('test-e2e:safari', [
         'connect:test-e2e',
         'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:desktop-browser', [
        'protractor:firefox',
        'protractor:chrome',
        'protractor:safari',
    ]);

    grunt.registerTask('test-e2e:iphone', [
        // TODO: appium has to run for this to work (node_modules/appium/bin/appium.js). Check how we can automate this.
        'connect:test-e2e',
        'protractor:iphone',
    ]);
}
