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
  classNameBindings: [":squiggle-canvas", "toolClass"],
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
  tool: function(){
    var tools = this.get("tools");
    return tools.findBy("isActive", true);
  }.property("tools.@each.isActive"),

  _register: function() {
    this.set('register-as', this); // register-as is a new property
  }.on('init'),

  style: function(){
    return ["width:" + this.get("width"),
     "height:" + this.get("height")].join(";")
  }.property("width", "height"),

  colors: [
    Color.create({color:"#FF4136"}),
    Color.create({color:"#FFDC00"}),
    Color.create({color:"#0074D9"}),
    Color.create({color:"#2ECC40"}),
    Color.create({color:"#000", selected:true})
  ],

  color: function(){
    return this.get("colors").findProperty("selected", true);
  }.property("colors.@each.selected"),

  textStyle: function(){
    return ["color:", this.get("color.color"),
    ";font-size:", this.get("smallSize") ? "14px": "24px", ";"].join("");
  }.property("color", "smallSize"),

  didInsertElement: function(){

    this.imageDidChange();
  },

  imageDidChange: function(){
    if(this.get("image")){
      this.$("img").one("load", Ember.$.proxy(this.createRaphael, this));
      this.$("img").one("error", Ember.$.proxy(this.errorLoadingImage, this));
    } else {
      this.createRaphael();
    }

  }.observes("image"),

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

    this._raphael = Raphael(this.$(".squiggle-paper")[0], width, height);
    this._shapes = [];

    this.loadTools();

    this.get("tool").enable();

    this._raphael.setViewBox(0,0, width, height);
    this._viewBoxWidth = width;

    if(this.get("image")){
      var image = this._raphael.image(this.get("image"), 0,0, width, height);
      image.node.setAttribute("class", "base");
    }

    this.updateBaseSvg();

    Ember.$(window).on("resize", function(){
      Ember.run.debounce(that, "changeSize", 100);
    });

    if(this.get("toolName") != "none"){
      var zoom = ZoomBrush.create({
        paper: this._raphael,
        el: this.$(".squiggle-paper")
      });
      zoom.enable();
    }
  },

  updateBaseSvg: function(){
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
  }.observes("baseSvg"),

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

  styleDidChange: function(){
    var tool = this.get("tool");
    if(!tool){
      return;
    }
    tool.set("brushColor", this.get("color.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
    tool.set("fontSize", this.get("smallSize") ? 14 : 24);

  }.observes("tool", "color", "smallSize"),

  changeSize: function(){
    this._raphael.setSize(this.$().width(),this.$().height());
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