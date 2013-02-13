/*jslint node: true */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['src/taboverride.js']
        },
        concat: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %>\r\n' +
                        'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.licenses[0].url %> */\r\n\r\n' +
                        '/**\r\n' +
                        ' * @fileOverview <%= pkg.name %>\r\n' +
                        ' * @author       <%= pkg.author.name %>\r\n' +
                        ' * @version      <%= pkg.version %>\r\n' +
                        ' */\r\n\r\n'
                },
                src: ['src/taboverride.js'],
                dest: 'build/taboverride.js'
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: true,
                preserveComments: 'some'
            },
            dist: {
                options: {
                    sourceMap: 'build/taboverride.min.js.map',
                    sourceMappingURL: 'taboverride.min.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    // the min file is moved to the build directory via a custom task
                    // this is to ensure the "file" field is set correctly in the source map
                    'taboverride.min.js': ['build/taboverride.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('moveMinJSFile', 'Moves the minified JS file to the build directory.', function () {
        grunt.task.requires(['uglify']);

        grunt.file.copy('taboverride.min.js', 'build/taboverride.min.js');
        grunt.file['delete']('taboverride.min.js');
    });

    grunt.registerTask('generateBowerManifest', 'Generates the bower.json file.', function () {
        grunt.config.requires(['pkg']);

        var contents = grunt.template.process('{\r\n' +
                '    "name": "<%= pkg.name %>",\r\n' +
                '    "version": "<%= pkg.version %>",\r\n' +
                '    "main": "./build/taboverride.js"\r\n' +
                '}\r\n');

        grunt.file.write('bower.json', contents);
    });

    // need to a create custom task for jsdoc-toolkit documentation

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'moveMinJSFile', 'generateBowerManifest']);
};
