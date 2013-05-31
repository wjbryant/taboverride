/*jshint node: true */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            output: ['build/output'],
            docs: ['docs']
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %>\r\n' +
                    'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.licenses[0].url %> */\r\n\r\n' +
                    '/**\r\n' +
                    ' * @fileOverview <%= pkg.name %>\r\n' +
                    ' * @author       <%= pkg.author.name %>\r\n' +
                    ' * @version      <%= pkg.version %>\r\n' +
                    ' */\r\n\r\n',
                separator: ''
            },
            umd: {
                src: ['build/fragments/umd-pre.js', 'src/taboverride.js', 'build/fragments/umd-post.js'],
                dest: 'build/output/taboverride.js'
            },
            cjs: {
                src: ['build/fragments/cjs-pre.js', 'src/taboverride.js', 'build/fragments/cjs-post.js'],
                dest: 'build/output/taboverride.js'
            },
            amd: {
                src: ['build/fragments/amd-pre.js', 'src/taboverride.js', 'build/fragments/amd-post.js'],
                dest: 'build/output/taboverride.js'
            },
            globals: {
                src: ['build/fragments/globals-pre.js', 'src/taboverride.js', 'build/fragments/globals-post.js'],
                dest: 'build/output/taboverride.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'build/output/taboverride.js',
                'test/test.js',
                'examples/js/*.js'
            ]
        },
        qunit: {
            all: ['test/index.html']
        },
        uglify: {
            options: {
                compress: true,
                mangle: true,
                preserveComments: 'some'
            },
            dist: {
                options: {
                    sourceMap: 'build/output/taboverride.min.js.map',
                    sourceMappingURL: 'taboverride.min.js.map',
                    sourceMapPrefix: 2
                },
                files: {
                    // the min file is moved to the build/output directory via a custom task
                    // this is to ensure the "file" field is set correctly in the source map
                    'taboverride.min.js': ['build/output/taboverride.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('moveMinJSFile', 'Moves the minified JS file to the build/output directory.', function () {
        grunt.task.requires(['uglify']);

        grunt.file.copy('taboverride.min.js', 'build/output/taboverride.min.js');
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

    grunt.registerTask('generateAPIDocs', 'Generates API documentation using JSDoc 3.', function () {
        //grunt.task.requires(['concat:umd']);

        var done = this.async(),
            jsdoc = 'node_modules/jsdoc/jsdoc',
            cmd = jsdoc,
            args = [];

        // work around for https://github.com/joyent/node/issues/2318
        if (process.platform === 'win32') {
            cmd = 'cmd';
            args.push('/c', jsdoc.replace(/\//g, '\\'));
        }

        args.push('-d', 'docs', 'build/output/taboverride.js');

        grunt.util.spawn(
            {
                cmd: cmd,
                args: args
            },
            function (error, result) {
                if (error) {
                    grunt.log.error(result.toString());
                }
                done(!error);
            }
        );
    });

    // umd
    grunt.registerTask('default', [
        'clean:output', 'concat:umd', 'jshint', 'qunit', 'uglify', 'moveMinJSFile',
        'generateBowerManifest', 'clean:docs', 'generateAPIDocs'
    ]);

    // cjs, amd, and globals tasks - just concat, lint, and minify, no testing or docs
    grunt.registerTask('cjs', ['clean:output', 'concat:cjs', 'jshint', 'uglify', 'moveMinJSFile']);
    grunt.registerTask('amd', ['clean:output', 'concat:amd', 'jshint', 'uglify', 'moveMinJSFile']);
    grunt.registerTask('globals', ['clean:output', 'concat:globals', 'jshint', 'uglify', 'moveMinJSFile']);
};
