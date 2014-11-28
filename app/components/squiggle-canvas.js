import Ember from "ember";
import PathBrush from "../brushes/path";
import TextBrush from "../brushes/text";
import Color from "../brushes/color";

export default Ember.Component.extend({
  layoutName: "components/squiggle-canvas",
  classNameBindings: [":squiggle-canvas"],
  attributeBindings: ["style"],
  width: 1024,
  height: 512,

  style: function(){
    return ["width:" + this.get("width") + "px",
     "height:" + this.get("height") + "px"].join(";")
  }.property("width", "height"),

  colors: [
    Color.create({color:"#FF4136"}),
    Color.create({color:"#FFDC00"}),
    Color.create({color:"#0074D9"}),
    Color.create({color:"#2ECC40"}),
    Color.create({color:"#000", selected:true})
  ],

  smallSize: false,

  image: "",

  eraserTool: function(){
    return PathBrush.create({
      paper: this._raphael,
      shapes: this._shapes,
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
      paper: this._raphael,
      shapes: this._shapes,
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

  createRaphael: function(){
    this._raphael = Raphael(this.$(".squiggle-paper")[0], this.get("width"), this.get("height"));
    this._shapes = [];

    this.get("tool").enable();
    this.configureTool();

  }.on("didInsertElement"),

  color: function(){
    return this.get("colors").findProperty("selected", true);
  }.property("colors.@each.selected"),

  configureTool: function(){
    var tool = this.get("tool");
    tool.set("brushColor", this.get("color.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
    tool.set("fontSize", this.get("smallSize") ? 14 : 24);
  }.observes("tool", "color", "smallSize"),

  textStyle: function(){
    return ["color:", this.get("color.color"),
    ";font-size:", this.get("smallSize") ? "14px": "24px", ";"].join("");
  }.property("color", "smallSize"),

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