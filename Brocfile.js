/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')

var app = new EmberAddon();

// var tree = pickFiles("tests/dummy/public", {
//   srcDir: '/',
//   destDir: 'public'
// });

module.exports = app.toTree();
