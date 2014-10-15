/**
 * Available tasks:
 *     - build: Builds the site and puts it into the build/ folder.
 *     - dev:   Starts a local DEV server at localhost:8000 and runs the watch task.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['src/index.html', 'src/scss/**/*.scss'],
            tasks: ['build']
        },

        connect: {
            options: {
                port:      8000,
                base:      'build',
                keepalive: false,
            },
            dev: {
                // a dummy target we can reference from the dev task
            }
        },

        sass: {
            build: {
                files: {
                    'build/main.css': 'src/main.scss'
                }
            }
        },

        copy: {
            build: {
                files: [
                    { src: 'src/index.html',                        dest: 'build/index.html' },
                    { src: 'src/favicon.ico',                       dest: 'build/favicon.ico' },
                    { src: 'src/apple-touch-icon-precomposed.png',  dest: 'build/apple-touch-icon-precomposed.png' },
                    { src: 'src/robots.txt',                        dest: 'build/robots.txt' },
                    { src: 'src/humans.txt',                        dest: 'build/humans.txt' },
                    { src: 'src/.htaccess',                         dest: 'build/.htaccess' },
                ]
            }
        },

        clean: {
            beforeBuild: ['build'],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('dev', [
        'connect:dev',
        'watch',
    ]);

    grunt.registerTask('build', [
        'clean:beforeBuild',
        'copy:build'
        'copy:build',
        'sass'
    ]);
}
