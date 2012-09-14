module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:taboverride.jquery.json>',
        meta: {
            banner: '/*! <%= pkg.title %> v<%= pkg.version %> | <%= pkg.homepage %>\r\n' +
                'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | ' +
                '<%= pkg.licenses[0].url %> */',
            fileOverview: '/**\r\n * @fileOverview <%= pkg.title %>\r\n' +
                ' * @author       <%= pkg.author.name %>\r\n * @version      <%= pkg.version %>\r\n */'
        },
        lint: {
            all: ['src/taboverride.js', 'src/taboverride-jquery-wrapper.js']
        },
        concat: {
            core: {
                src: ['<banner>', '<banner:meta.fileOverview>', 'src/taboverride.js'],
                dest: 'build/taboverride.js'
            },
            jquery: {
                src: ['build/taboverride.js', 'src/taboverride-jquery-wrapper.js'],
                dest: 'build/jquery.taboverride.js'
            }
        },
        min: {
            core: {
                src: ['<banner>', 'build/taboverride.js'],
                dest: 'build/taboverride.min.js'
            },
            jquery: {
                src: ['<banner>', 'build/jquery.taboverride.js'],
                dest: 'build/jquery.taboverride.min.js'
            }
        }
        // need to a create custom task for jsdoc-toolkit documentation
    });
    grunt.registerTask('default', 'lint concat min');
};