import Ember from "ember";
import Patches from "squiggle/utils/raphael-patch";
import BaseBrush from "squiggle/brushes/base";
import PathBrush from "squiggle/brushes/path";
import PolygonBrush from "squiggle/brushes/polygon";
import TextBrush from "squiggle/brushes/text";
import EraseBrush from "squiggle/brushes/eraser";
import ZoomBrush from "squiggle/brushes/zoom";
import NavBrush from "squiggle/brushes/nav";
import MarkerBrush from "squiggle/brushes/marker";
import MarkerSingleBrush from "squiggle/brushes/marker-single";
import SvgBrush from "squiggle/brushes/svg";
import Color from "squiggle/brushes/color";

import PngExport from "squiggle/mixins/export-to-png";
import SvgExport from "squiggle/mixins/export-to-svg";

var defaultTools = [
  EraseBrush,
  NavBrush,
  PathBrush,
  PolygonBrush,
  TextBrush,
  MarkerBrush,
  MarkerSingleBrush,
  SvgBrush,
  BaseBrush
];

export default Ember.Component.extend(PngExport, SvgExport, {
  layoutName: "components/squiggle-canvas",
  classNameBindings: [":squiggle-canvas", "toolClass", "showTools:with-tools"],
  attributeBindings: ["style"],

  // either provide width + height or an image
  width: "100%",
  height: "auto",
  image: null,

  smallSize: false,

  isFirstPalette: true,
  showColors: false,
  showSizes: false,
  showBrushes: false,
  showTools: true,

  tools: [],

  toolConfig: "squiggle:tools",

  loadTools: function(){
    var config = this.container.lookup(this.get("toolConfig")) || defaultTools;

    var tools =  config.map(function(c){
      return c.create({
        paper: this._raphael,
        el: this.$(".squiggle-paper")
      });
    }, this);
    this.set("tools", tools);

    var tool = tools.findBy("name", this.get("toolName"));
    tool.set("isActive", true);
  },
  toolName: "squiggle-path",
  tool: Ember.computed("tools.@each.isActive", function(){
    var tools = this.get("tools");
    return tools.findBy("isActive", true);
  }),

  style: Ember.computed("width", "height", function(){
    return ["width:" + this.get("width"),
     "height:" + this.get("height")].join(";").htmlSafe();
  }),

  colors: [
    Color.create({color:"#FF4136"}),
    Color.create({color:"#FFDC00"}),
    Color.create({color:"#0074D9"}),
    Color.create({color:"#2ECC40"}),
    Color.create({color:"#000", selected:true})
  ],

  color: Ember.computed("colors.@each.selected", function(){
    return this.get("colors").findBy("selected", true);
  }),

  textStyle: Ember.computed( "color", "smallSize", function(){
    return ["color:", this.get("color.color"),
    ";font-size:", this.get("smallSize") ? "14px": "24px", ";"].join("").htmlSafe();
  }),

  didInsertElement: function(){
    if(this.get("image")){
      this.$("img").one("load", Ember.$.proxy(this.createRaphael, this));
      this.$("img").one("error", Ember.$.proxy(this.errorLoadingImage, this));
    } else {
      Ember.run.later(this, function(){
        this.imageDidChange();
      });
    }
  },

  willDestroyElement: function(){
    Ember.$(window).off("resize." + this.get("elementId"));
  },

  imageDidChange: Ember.observer("image", function(){
    if(this.get("image")){
      this.$("img").one("load", Ember.$.proxy(this.createRaphael, this));
      this.$("img").one("error", Ember.$.proxy(this.errorLoadingImage, this));
    } else {
      this.createRaphael();
    }

  }),

  errorLoadingImage: function(){
    var message = "There was an error loading the image.";
    if(Ember.I18n){
      message = Ember.I18n.t("squiggle.image_error");
    }
    alert(message);
    this.inError = true;
    this.sendAction( "error");
  },

  createRaphael: function(){
    var that = this,
        width = this.$().width(),
        height = this.$().height();
    this.$(".squiggle-paper svg").remove();

    this.set('register-as', this);

    this._raphael = Raphael(this.$(".squiggle-paper")[0], width, height);
    this._shapes = [];

    this.loadTools();

    this.get("tool").enable();
    this.styleDidChange();

    this._raphael.setViewBox(0,0, width, height);
    this._viewBoxWidth = width;

    this.$(".squiggle-paper svg").prepend("<desc class='width'>" + width + "</desc>");

    if(this.get("image")){
      var image = this._raphael.image(this.get("image"), 0,0, width, height);
      image.node.setAttribute("class", "base");
    }

    this.updateBaseSvg();

    Ember.$(window).on("resize." + this.get("elementId"), function(){
      Ember.run.debounce(that, "changeSize", 100);
    });

    if(this.get("toolName") != "none"){
      var zoom = ZoomBrush.create({
        paper: this._raphael,
        el: this.$(".squiggle-paper"),
        component: this
      });
      zoom.enable();
      zoom.on("zoom", this, "enableNav");
    }
  },

  enableNav: function(){
    var navTool = this.get("tools").findBy("name", "squiggle-nav");
    if(navTool && this.get("tool") != navTool && this.get("showTools")){
      this.enableTool(navTool);
    }
  },

  updateBaseSvg: Ember.observer("baseSvg", function(){
    if(!this._raphael){
      return;
    }

    var baseSvg = this.get("baseSvg"),
        width = this._viewBoxWidth,
        g = this.$().find("#base-svg");
    g.remove();
    if(baseSvg){
      g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute("transform", "scale("+ width +")");
      g.setAttribute("id", "base-svg");

      g.appendChild(this.parseSvg(baseSvg));
      this.$(".squiggle-paper svg")[0].appendChild(g);
    }
  }),

  //
  // This is needed as a simple append will not respect svg namespace.
  //
  parseSvg: function(s) {
    var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
    var frag= document.createDocumentFragment();
    while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
  },

  revertAll: function(){
    this.createRaphael();
  },

  enableTool: function(tool){
    var tools = this.get("tools");

    tool.enable();
    this.get("tool").disable();
    tools.setEach("isActive", false);
    tool.set("isActive", true);
  },

  styleDidChange: Ember.observer("tool", "color", "smallSize", function(){
    var tool = this.get("tool");
    if(!tool){
      return;
    }
    tool.set("brushColor", this.get("color.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
    tool.set("fontSize", this.get("smallSize") ? 14 : 24);

  }),

  changeSize: function(){
    this._raphael.setSize(this.$().width(),this.$().height());
    this.updateBaseSvg();
  },

  togglePalette: function(type, callback){
    if( this.get("isFirstPalette") ){
      this.set("isFirstPalette", false);
      this.set(type, true);
    } else {
      this.set("isFirstPalette", true);
      this.set(type, false);

      callback.apply(this);
    }
  },

  actions: {
    selectTool: function(tool){
      this.togglePalette("showBrushes", function(){
        this.enableTool(tool);
      });
    },
    selectColor: function(color){
      this.togglePalette("showColors", function(){
        this.set("color.selected", false);
        color.set("selected", true);
      });
    },
    selectSize: function(size){
      this.togglePalette("showSizes", function(){
        this.set("smallSize", size == "small");
      });
    }
  }
});