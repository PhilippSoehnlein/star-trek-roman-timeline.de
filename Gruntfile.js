/**
 * Available tasks:
 *     - build: Builds the site and puts it into the build/ folder.
 *     - dev:   Makes a build, starts a local DEV server at localhost:8000 and runs the watch task.
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
    });

    grunt.loadNpmTasks('grunt-ejs-render');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');

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
}
