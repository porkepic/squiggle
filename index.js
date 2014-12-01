'use strict';
var compileLess = require('broccoli-less-single');
var pickFiles = require('broccoli-static-compiler')

module.exports = {
  name: 'squiggle',
  treeForStyles: function(){
    var tree = pickFiles("app/styles", {
      srcDir: '/',
      destDir: 'squiggle'
    });
    return compileLess(tree, 'squiggle/app.less', 'assets/app.css')
  },
  included: function(app){
    app.import('assets/app.css');

    app.import('bower_components/raphael/raphael.js');
    app.import('bower_components/hammerjs/hammer.js');
    app.import('bower_components/jquery-mousewheel/jquery.mousewheel.js');

  }
};
