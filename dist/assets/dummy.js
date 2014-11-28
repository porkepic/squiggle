eval("//# sourceURL=vendor/ember-cli/loader.js");

;eval("define(\"dummy/app\", \n  [\"ember\",\"ember/resolver\",\"ember/load-initializers\",\"dummy/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Resolver = __dependency2__[\"default\"];\n    var loadInitializers = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    Ember.MODEL_FACTORY_INJECTIONS = true;\n\n    var App = Ember.Application.extend({\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix,\n      Resolver: Resolver\n    });\n\n    loadInitializers(App, config.modulePrefix);\n\n    __exports__[\"default\"] = App;\n  });//# sourceURL=dummy/app.js");

;eval("define(\"dummy/brushes/base\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Object.extend({\n      brush: Ember.K\n    });\n  });//# sourceURL=dummy/brushes/base.js");

;eval("define(\"dummy/brushes/color\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Object.extend({\n      color: null,\n      style: function(){\n        var color = this.get(\"color\");\n        return [\"background-color:\", \";\"].join(color);\n      }.property(\"color\")\n    });\n  });//# sourceURL=dummy/brushes/color.js");

;eval("define(\"dummy/brushes/empty\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Object.extend({\n      enable: Ember.K,\n      disable: Ember.K\n    });\n  });//# sourceURL=dummy/brushes/empty.js");

;eval("define(\"dummy/brushes/eraser\", \n  [\"ember\",\"dummy/brushes/select\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Select = __dependency2__[\"default\"];\n\n    __exports__[\"default\"] = Select.extend({\n      select: function(e){\n        if(this._selection == e.target){\n          // check for i18n\n          var message = \"Do you want to delete this note?\";\n          if(Ember.I18n){\n            message = Ember.I18n.t(\"squiggle.erase_confirm\");\n          }\n          if(confirm(message)){\n            Ember.$(e.target).remove();\n            this.get(\"el\").find(\".highlight,.highlight-select,.text-highlight,.text-highlight-select\").remove();\n          }\n        }else{\n          this._super(e);  \n        }\n      }\n    });\n  });//# sourceURL=dummy/brushes/eraser.js");

;eval("define(\"dummy/brushes/select\", \n  [\"ember\",\"dummy/brushes/base\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Base = __dependency2__[\"default\"];\n\n    __exports__[\"default\"] = Base.extend({\n      el: null,\n\n      enable: function(){\n        var el = this.get(\"el\"),\n            selection = el.find(\"div, path:not(.highlight)\");\n        selection.on(\"mouseenter\", Ember.$.proxy(this.highlight, this));\n        selection.on(\"mouseleave\", Ember.$.proxy(this.clearHighlights, this));\n        selection.on(\"click\", Ember.$.proxy(this.select, this));\n      },\n\n      disable: function(){\n        var el = this.get(\"el\"),\n            selection = el.find(\"div, path:not(.highlight)\");\n\n        selection.off(\"mouseenter\");\n        selection.off(\"mouseleave\");\n        selection.off(\"click\");\n      },\n\n      highlight: function(e){\n        var target = Ember.$(e.target),\n            el = this.get(\"el\"),\n            highlight;\n\n        this.clearHighlights();\n\n        if(e.target.tagName == \"DIV\"){\n          target.addClass(\"text-highlight\");\n        }else{\n          // for paths\n          highlight = target.clone()\n          highlight.attr(\"class\", \"highlight\");\n          highlight.insertBefore(target);\n        }\n      },\n\n      clearHighlights: function(e){\n        // clear all other highlight\n        var el = this.get(\"el\");\n        el.find(\".highlight\").remove();\n        el.find(\".text-highlight\").removeClass(\"text-highlight\");\n      },\n\n      select: function(e){\n        var target = Ember.$(e.target),\n            el = this.get(\"el\"),\n            highlight;\n\n        this.clearHighlights();\n\n        el.find(\".highlight-select\").remove();\n        el.find(\".text-highlight-select\").removeClass(\"text-highlight-select\");\n\n        this._selection = e.target;\n\n        if(e.target.tagName == \"DIV\"){\n          target.addClass(\"text-highlight-select\");\n        }else{\n          // for paths\n          highlight = target.clone()\n          highlight.attr(\"class\", \"highlight-select\");\n          highlight.insertBefore(target);\n        }\n      }\n    });\n  });//# sourceURL=dummy/brushes/select.js");

;eval("define(\"dummy/brushes/path\", \n  [\"ember\",\"dummy/brushes/base\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Base = __dependency2__[\"default\"];\n\n    __exports__[\"default\"] = Base.extend({\n      paper: null,\n      shapes: null,\n      el: null,\n\n      _savedPath: null,\n      _shape: null,\n\n      events: function(){\n        var events = new Hammer(this.get(\"el\").find(\"svg\")[0]);\n        return events;\n      }.property(\"el\"),\n\n      enable: function(){\n        var events = this.get(\"events\");\n\n        this._shape = this._savedPath = null;\n\n        events.get(\'pan\').set({ direction: Hammer.DIRECTION_ALL });\n        events.on(\"panstart\", Ember.$.proxy(this.start, this));\n        events.on(\"panmove\", Ember.$.proxy(this.move, this));\n        events.on(\"panend\", Ember.$.proxy(this.end, this));\n      },\n\n      disable: function(){\n        var events = this.get(\"events\");\n        events.off(\"panstart\");\n        events.off(\"panmove\");\n        events.off(\"panend\");\n      },\n\n      start: function(e){\n        var center = e.center,\n            startx = center.x,\n            starty = center.y,\n            paper = this.get(\"paper\"),\n            offset = this.get(\"el\").offset(),\n            shapes = this.get(\"shapes\"),\n            events = this.get(\"events\");\n\n        startx = startx - offset.left + $(window).scrollLeft();\n        starty = starty - offset.top + $(window).scrollTop();\n\n        this._shape = paper.path(\"M\"+startx+ \" \" +starty);\n        this._savedPath = this._shape.attr(\'path\');\n\n        shapes.push(this._shape);\n        this._shape.attr(\'stroke-width\',  this.get(\"brushWidth\"));\n        this._shape.attr(\'stroke\', this.get(\"brushColor\"));\n      },\n\n      move: function(e){\n        var path = this._savedPath,\n            added_path = [],\n            offset = this.get(\"el\").offset(),\n            center = e.center;\n        e = e.srcEvent;\n        added_path.push(\"L\");\n        added_path.push(center.x - offset.left + $(window).scrollLeft());\n        added_path.push(center.y - offset.top + $(window).scrollTop());\n        path.push(added_path);\n        this._shape.attr(\'path\', path);\n      },\n\n      end: function(e){\n        this._shape = this._savedPath = null;\n      }\n    });\n  });//# sourceURL=dummy/brushes/path.js");

;eval("define(\"dummy/brushes/text\", \n  [\"ember\",\"dummy/brushes/base\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Base = __dependency2__[\"default\"];\n\n    __exports__[\"default\"] = Base.extend({\n      el: null,\n      \n      events: function(){\n        var events = new Hammer(this.get(\"el\").find(\"svg\")[0]);\n        return events;\n      }.property(\"el\"),\n\n      enable: function(){\n        var events = this.get(\"events\");\n\n        events.get(\'pan\').set({ direction: Hammer.DIRECTION_ALL });\n        events.on(\"panstart\", Ember.$.proxy(this.start, this));\n        events.on(\"panmove\", Ember.$.proxy(this.move, this));\n        events.on(\"panend\", Ember.$.proxy(this.end, this));\n        events.on(\"tap\", Ember.$.proxy(this.startTap, this));\n      },\n\n      disable: function(){\n        var events = this.get(\"events\");\n        events.off(\"panstart\");\n        events.off(\"panmove\");\n        events.off(\"panend\");\n        events.off(\"tap\");\n      },\n\n      startTap: function(e){\n        this.start(e);\n        this._area.css( this.checkEdges({\n          top: +this._area.css(\"top\").replace(\"px\", \"\"),\n          left: +this._area.css(\"left\").replace(\"px\", \"\"),\n          width: 200,\n          height: 50\n        }));\n        this.end();\n      },\n\n      start: function(e){\n        // first place the textarea at the starting point.\n        var el = this.get(\"el\"),\n            center = e.center,\n            startx = center.x,\n            starty = center.y,\n            offset = this.get(\"el\").offset();\n\n        this._area = el.find(\"textarea\");\n        this._area.css({\n          top: center.y - offset.top + $(window).scrollTop(),\n          left: center.x - offset.left + $(window).scrollLeft()\n        });\n        this._area.addClass(\"active\");\n        this._initialCenter = center;\n      },\n\n      move: function(e){\n        // when moving resize the area\n        var center = e.center,\n            offset = this.get(\"el\").offset(),\n            box;\n\n        // check edge case when not growing the area\n        if(center.x < this._initialCenter.x || center.y < this._initialCenter.y){\n          var c = this._initialCenter;\n          this._initialCenter = center;\n          center = c;\n        }\n\n        // set the top/left, width/height\n\n        box = {\n          top: this._initialCenter.y - offset.top + $(window).scrollTop(),\n          left: this._initialCenter.x - offset.left + $(window).scrollLeft(),\n          width: center.x - this._initialCenter.x,\n          height: center.y - this._initialCenter.y\n        };\n\n        this._area.css( this.checkEdges(box) );\n      },\n\n      end: function(e){\n        this._area.focus();\n        this._area.one(\"blur\", Ember.$.proxy(this.convertToSVG, this));\n      },\n\n      checkEdges: function(box){\n        var el = this.get(\"el\"),\n            width = el.width(),\n            height = el.height();\n\n        // account for 10 px for the padding and border;\n        if(box.left + box.width > width){\n          box.width = width - box.left - 10;\n        }\n        if(box.top + box.height > height){\n          box.height = height - box.top - 10;\n        }\n        return box;\n      },\n\n      convertToSVG: function(){\n        var value = this._area.val(),\n            paper = this.get(\"el\").find(\"svg\")[0],\n            text = document.createElementNS(\"http://www.w3.org/1999/xhtml\", \"div\"),\n            fo = document.createElementNS(\'http://www.w3.org/2000/svg\', \'foreignObject\'),\n            style = [\"color:\", this.get(\"brushColor\"),\n                     \";font-family: sans-serif;overflow-wrap: break-word;\",\n                     \";font-size:\", this.get(\"fontSize\"), \"px\",\n                     \";width:\", this._area.css(\"width\")].join(\"\");\n        if(value && value.length > 0){\n          // configure the elements to fit in the bounded box\n          fo.setAttribute(\"x\", this._area.css(\"left\").replace(\"px\", \"\"));\n          fo.setAttribute(\"y\", this._area.css(\"top\").replace(\"px\", \"\"));\n          fo.setAttribute(\"width\", 8 + (+this._area.css(\"width\").replace(\"px\", \"\")));\n          fo.setAttribute(\"height\", 8 + (+this._area.css(\"height\").replace(\"px\", \"\")));\n\n          text.innerHTML =  value.replace(/\\n/g, \"<br/>\");\n          text.style.color = this.get(\"brushColor\");\n          text.style.fontFamily = \"sans-serif\";\n          text.style.fontSize = this.get(\"fontSize\") + \"px\";\n          text.style.overflowWrap = \"break-word\";\n          text.style.width = this._area.css(\"width\");\n          text.style.border = \"4px dashed transparent\";\n\n          // insert everything into the dom\n          fo.appendChild(text);\n          paper.appendChild(fo);\n        }\n\n        // remove the value for next use.\n        this._area.val(\"\");\n        this._area.removeClass(\"active\");\n        this._area.css({\n          width: 0,\n          height: 0\n        });\n      }\n    });\n  });//# sourceURL=dummy/brushes/text.js");

;eval("define(\"dummy/components/squiggle-canvas\", \n  [\"ember\",\"dummy/brushes/path\",\"dummy/brushes/text\",\"dummy/brushes/eraser\",\"dummy/brushes/color\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var PathBrush = __dependency2__[\"default\"];\n    var TextBrush = __dependency3__[\"default\"];\n    var EraseBrush = __dependency4__[\"default\"];\n    var Color = __dependency5__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Component.extend({\n      layoutName: \"components/squiggle-canvas\",\n      classNameBindings: [\":squiggle-canvas\"],\n      attributeBindings: [\"style\"],\n      width: 1024,\n      height: 512,\n\n      style: function(){\n        return [\"width:\" + this.get(\"width\") + \"px\",\n         \"height:\" + this.get(\"height\") + \"px\"].join(\";\")\n      }.property(\"width\", \"height\"),\n\n      colors: [\n        Color.create({color:\"#FF4136\"}),\n        Color.create({color:\"#FFDC00\"}),\n        Color.create({color:\"#0074D9\"}),\n        Color.create({color:\"#2ECC40\"}),\n        Color.create({color:\"#000\", selected:true})\n      ],\n\n      smallSize: false,\n\n      image: \"\",\n\n      eraserTool: function(){\n        return EraseBrush.create({\n          el: this.$(\".squiggle-paper\")\n        })\n      }.property(),\n\n      pathTool: function(){\n        return PathBrush.create({\n          paper: this._raphael,\n          shapes: this._shapes,\n          el: this.$(\".squiggle-paper\")\n        })\n      }.property(),\n\n      textTool: function(){\n        return TextBrush.create({\n          el: this.$(\".squiggle-paper\")\n        })\n      }.property(),\n\n      selectTool: function(){\n        return SelectBrush.create({\n          el: this.$(\".squiggle-paper\")\n        })\n      }.property(),\n\n      toolName: \"path\",\n      tool: function(){\n        var tool = this.get(\"toolName\");\n        return this.get(tool + \"Tool\");\n      }.property(\"toolName\"),\n\n      isEraserTool: Ember.computed.equal(\"toolName\", \"eraser\"),\n      isPathTool: Ember.computed.equal(\"toolName\", \"path\"),\n      isTextTool: Ember.computed.equal(\"toolName\", \"text\"),\n      isSelectTool: Ember.computed.equal(\"toolName\", \"select\"),\n\n      createRaphael: function(){\n        this._raphael = Raphael(this.$(\".squiggle-paper\")[0], this.get(\"width\"), this.get(\"height\"));\n        this._shapes = [];\n\n        this.get(\"tool\").enable();\n        this.configureTool();\n\n      }.on(\"didInsertElement\"),\n\n      color: function(){\n        return this.get(\"colors\").findProperty(\"selected\", true);\n      }.property(\"colors.@each.selected\"),\n\n      configureTool: function(){\n        var tool = this.get(\"tool\");\n        tool.set(\"brushColor\", this.get(\"color.color\"));\n        tool.set(\"brushWidth\", this.get(\"smallSize\") ? 4 : 8);\n        tool.set(\"fontSize\", this.get(\"smallSize\") ? 14 : 24);\n      }.observes(\"tool\", \"color\", \"smallSize\"),\n\n      textStyle: function(){\n        return [\"color:\", this.get(\"color.color\"),\n        \";font-size:\", this.get(\"smallSize\") ? \"14px\": \"24px\", \";\"].join(\"\");\n      }.property(\"color\", \"smallSize\"),\n\n      actions: {\n        selectTool: function(tool){\n          this.get(\"tool\").disable();\n          this.set(\"toolName\", tool);\n          this.get(\"tool\").enable();\n        },\n        selectColor: function(color){\n          this.set(\"color.selected\", false);\n          color.set(\"selected\", true);\n        },\n        setSmallSize: function(){\n          this.set(\"smallSize\", true);\n        },\n        setLargeSize: function(){\n          this.set(\"smallSize\", false);\n        }\n      }\n    });\n  });//# sourceURL=dummy/components/squiggle-canvas.js");

;eval("define(\"dummy/initializers/export-application-global\", \n  [\"ember\",\"dummy/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    function initialize(container, application) {\n      var classifiedName = Ember.String.classify(config.modulePrefix);\n\n      if (config.exportApplicationGlobal) {\n        window[classifiedName] = application;\n      }\n    };\n    __exports__.initialize = initialize;\n    __exports__[\"default\"] = {\n      name: \'export-application-global\',\n\n      initialize: initialize\n    };\n  });//# sourceURL=dummy/initializers/export-application-global.js");

;eval("define(\"dummy/router\", \n  [\"ember\",\"dummy/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var Router = Ember.Router.extend({\n      location: config.locationType\n    });\n\n    Router.map(function() {\n    });\n\n    __exports__[\"default\"] = Router;\n  });//# sourceURL=dummy/router.js");

;eval("define(\"dummy/templates/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data\n    /**/) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;\n\n\n      data.buffer.push(\"<h2 id=\'title\'>Welcome to Ember.js</h2>\\n\\n\");\n      data.buffer.push(escapeExpression((helper = helpers[\'squiggle-canvas\'] || (depth0 && depth0[\'squiggle-canvas\']),options={hash:{\n        \'image\': (\"http://www.ljefferyroofing.com/images/portfolio_6.jpg\")\n      },hashTypes:{\'image\': \"STRING\"},hashContexts:{\'image\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"squiggle-canvas\", options))));\n      return buffer;\n      \n    });\n  });//# sourceURL=dummy/templates/application.js");

;eval("define(\"dummy/templates/components/squiggle-canvas\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data\n    /**/) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, escapeExpression=this.escapeExpression, self=this;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\';\n      data.buffer.push(\"\\n      <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-color color.selected:active\"),\n        \'style\': (\"color.style\")\n      },hashTypes:{\'class\': \"STRING\",\'style\': \"STRING\"},hashContexts:{\'class\': depth0,\'style\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"selectColor\", \"color\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:[\"STRING\",\"ID\"],data:data})));\n      data.buffer.push(\">\\n      </div>\\n    \");\n      return buffer;\n      }\n\n      data.buffer.push(\"<img \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'src\': (\"image\")\n      },hashTypes:{\'src\': \"STRING\"},hashContexts:{\'src\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\"/>\\n<div class=\\\"squiggle-paper\\\">\\n\\n  <textarea \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'style\': (\"textStyle\")\n      },hashTypes:{\'style\': \"STRING\"},hashContexts:{\'style\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\"></textarea>\\n</div>\\n\\n<div class=\\\"squiggle-tools\\\">\\n  <div class=\\\"squiggle-colors\\\">\\n    \");\n      stack1 = helpers.each.call(depth0, \"color\", \"in\", \"colors\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:[\"ID\",\"ID\",\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n  </div>\\n  <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\"isTextTool:squiggle-text-size :squiggle-sizes\"),\n        \'style\': (\"textStyle\")\n      },hashTypes:{\'class\': \"STRING\",\'style\': \"STRING\"},hashContexts:{\'class\': depth0,\'style\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\">\\n    <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-size :small smallSize:active\")\n      },hashTypes:{\'class\': \"STRING\"},hashContexts:{\'class\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"setSmallSize\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">\\n      <div class=\\\"bar\\\" \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'style\': (\"color.style\")\n      },hashTypes:{\'style\': \"STRING\"},hashContexts:{\'style\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\"></div>\\n    </div>\\n    <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-size smallSize::active\")\n      },hashTypes:{\'class\': \"STRING\"},hashContexts:{\'class\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"setLargeSize\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">\\n      <div class=\\\"bar\\\" \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'style\': (\"color.style\")\n      },hashTypes:{\'style\': \"STRING\"},hashContexts:{\'style\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\"></div>\\n    </div>\\n  </div>\\n  <div class=\\\"squiggle-brushes\\\">\\n    <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-brush :squiggle-eraser isEraserTool:active\")\n      },hashTypes:{\'class\': \"STRING\"},hashContexts:{\'class\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"selectTool\", \"eraser\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:[\"STRING\",\"STRING\"],data:data})));\n      data.buffer.push(\"></div>\\n    <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-brush :squiggle-path isPathTool:active\")\n      },hashTypes:{\'class\': \"STRING\"},hashContexts:{\'class\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"selectTool\", \"path\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:[\"STRING\",\"STRING\"],data:data})));\n      data.buffer.push(\"></div>\\n    <div \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'class\': (\":squiggle-brush :squiggle-text isTextTool:active\")\n      },hashTypes:{\'class\': \"STRING\"},hashContexts:{\'class\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"selectTool\", \"text\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:[\"STRING\",\"STRING\"],data:data})));\n      data.buffer.push(\"></div>\\n  </div>\\n</div>\");\n      return buffer;\n      \n    });\n  });//# sourceURL=dummy/templates/components/squiggle-canvas.js");

;eval("define(\"dummy/tests/app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'app.js should pass jshint\', function() { \n      ok(true, \'app.js should pass jshint.\'); \n    });\n  });//# sourceURL=dummy/tests/app.jshint.js");

;eval("define(\"dummy/tests/dummy/tests/helpers/resolver.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - dummy/tests/helpers\');\n    test(\'dummy/tests/helpers/resolver.js should pass jshint\', function() { \n      ok(true, \'dummy/tests/helpers/resolver.js should pass jshint.\'); \n    });\n  });//# sourceURL=dummy/tests/dummy/tests/helpers/resolver.jshint.js");

;eval("define(\"dummy/tests/dummy/tests/helpers/start-app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - dummy/tests/helpers\');\n    test(\'dummy/tests/helpers/start-app.js should pass jshint\', function() { \n      ok(true, \'dummy/tests/helpers/start-app.js should pass jshint.\'); \n    });\n  });//# sourceURL=dummy/tests/dummy/tests/helpers/start-app.jshint.js");

;eval("define(\"dummy/tests/dummy/tests/test-helper.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - dummy/tests\');\n    test(\'dummy/tests/test-helper.js should pass jshint\', function() { \n      ok(true, \'dummy/tests/test-helper.js should pass jshint.\'); \n    });\n  });//# sourceURL=dummy/tests/dummy/tests/test-helper.jshint.js");

;eval("define(\"dummy/tests/helpers/resolver\", \n  [\"ember/resolver\",\"dummy/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Resolver = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var resolver = Resolver.create();\n\n    resolver.namespace = {\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix\n    };\n\n    __exports__[\"default\"] = resolver;\n  });//# sourceURL=dummy/tests/helpers/resolver.js");

;eval("define(\"dummy/tests/helpers/start-app\", \n  [\"ember\",\"dummy/app\",\"dummy/router\",\"dummy/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Application = __dependency2__[\"default\"];\n    var Router = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    __exports__[\"default\"] = function startApp(attrs) {\n      var App;\n\n      var attributes = Ember.merge({}, config.APP);\n      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;\n\n      Router.reopen({\n        location: \'none\'\n      });\n\n      Ember.run(function() {\n        App = Application.create(attributes);\n        App.setupForTesting();\n        App.injectTestHelpers();\n      });\n\n      App.reset(); // this shouldn\'t be needed, i want to be able to \"start an app at a specific URL\"\n\n      return App;\n    }\n  });//# sourceURL=dummy/tests/helpers/start-app.js");

;eval("define(\"dummy/tests/router.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'router.js should pass jshint\', function() { \n      ok(true, \'router.js should pass jshint.\'); \n    });\n  });//# sourceURL=dummy/tests/router.jshint.js");

;eval("define(\"dummy/tests/test-helper\", \n  [\"dummy/tests/helpers/resolver\",\"ember-qunit\"],\n  function(__dependency1__, __dependency2__) {\n    \"use strict\";\n    var resolver = __dependency1__[\"default\"];\n    var setResolver = __dependency2__.setResolver;\n\n    setResolver(resolver);\n\n    document.write(\'<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>\');\n\n    QUnit.config.urlConfig.push({ id: \'nocontainer\', label: \'Hide container\'});\n    var containerVisibility = QUnit.urlParams.nocontainer ? \'hidden\' : \'visible\';\n    document.getElementById(\'ember-testing-container\').style.visibility = containerVisibility;\n  });//# sourceURL=dummy/tests/test-helper.js");

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */


});

if (runningTests) {
  require('dummy/tests/test-helper');
} else {
  require('dummy/app')['default'].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
