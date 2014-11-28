import Ember from "ember";
import PathBrush from "../brushes/path";
import TextBrush from "../brushes/text";
import EraseBrush from "../brushes/eraser";
import Color from "../brushes/color";

export default Ember.Component.extend({
  layoutName: "components/squiggle-canvas",
  classNameBindings: [":squiggle-canvas"],
  attributeBindings: ["style"],

  // either provide width + height or an image
  width: "100%",
  height: "auto",
  image: null,

  smallSize: false,
  showColors: true,
  showSizes: true,
  showTools: true,

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

  eraserTool: function(){
    return EraseBrush.create({
      el: this.$(".squiggle-paper")
    })
  }.property(),

  pathTool: function(){
    return PathBrush.create({
      paper: this._raphael,
      shapes: this._shapes,
      el: this.$(".squiggle-paper")
    })
  }.property(),

  textTool: function(){
    return TextBrush.create({
      el: this.$(".squiggle-paper")
    })
  }.property(),

  selectTool: function(){
    return SelectBrush.create({
      el: this.$(".squiggle-paper")
    })
  }.property(),

  toolName: "path",
  tool: function(){
    var tool = this.get("toolName");
    return this.get(tool + "Tool");
  }.property("toolName"),

  isEraserTool: Ember.computed.equal("toolName", "eraser"),
  isPathTool: Ember.computed.equal("toolName", "path"),
  isTextTool: Ember.computed.equal("toolName", "text"),
  isSelectTool: Ember.computed.equal("toolName", "select"),

  color: function(){
    return this.get("colors").findProperty("selected", true);
  }.property("colors.@each.selected"),

  textStyle: function(){
    return ["color:", this.get("color.color"),
    ";font-size:", this.get("smallSize") ? "14px": "24px", ";"].join("");
  }.property("color", "smallSize"),

  didInsertElement: function(){
    if(this.get("image")){
      this.$("img").on("load", Ember.$.proxy(this.createRaphael, this));
    } else {
      this.createRaphael();
    }
  },

  createRaphael: function(){
    var that = this;
    this._raphael = Raphael(this.$(".squiggle-paper")[0], this.$().width(),this.$().height());
    this._shapes = [];

    this.get("tool").enable();
    this.configureTool();

    // this.changeViewBox();
    this._raphael.setViewBox(0,0, this.$().width(),this.$().height());
    Ember.$(window).on("resize", function(){
      Ember.run.debounce(that, "changeViewBox", 100);
    });
  },

  configureTool: function(){
    var tool = this.get("tool");
    tool.set("brushColor", this.get("color.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
    tool.set("fontSize", this.get("smallSize") ? 14 : 24);
  }.observes("tool", "color", "smallSize"),

  changeViewBox: function(){
    this._raphael.setSize(this.$().width(),this.$().height());
  },

  actions: {
    selectTool: function(tool){
      this.get("tool").disable();
      this.set("toolName", tool);
      this.get("tool").enable();
    },
    selectColor: function(color){
      this.set("color.selected", false);
      color.set("selected", true);
    },
    setSmallSize: function(){
      this.set("smallSize", true);
    },
    setLargeSize: function(){
      this.set("smallSize", false);
    }
  }
});