import Ember from "ember";
import PathBrush from "../brushes/path";
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

  pathTool: function(){
    return PathBrush.create({
      paper: this._raphael,
      shapes: this._shapes,
      el: this.$(".squiggle-paper")
    })
  }.property(),

  createRaphael: function(){
    this._raphael = Raphael(this.$(".squiggle-paper")[0], this.get("width"), this.get("height"));
    this._shapes = [];

    this.get("currentTool").enable();
    this.configureTool();

  }.on("didInsertElement"),

  currentToolName: "path",
  currentTool: function(){
    var currentTool = this.get("currentToolName");
    return this.get(currentTool + "Tool");
  }.property("currentToolName"),

  currentColor: function(){
    return this.get("colors").findProperty("selected", true);
  }.property("colors.@each.selected"),

  configureTool: function(){
    var tool = this.get("currentTool");
    tool.set("brushColor", this.get("currentColor.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
  }.observes("currentTool", "currentColor", "smallSize"),

  actions: {
    selectTool: function(tool){
      this.get("currentTool").disable();
      this.set("currentToolName", tool);
      this.get("currentTool").enable();
    },
    selectColor: function(color){
      this.set("currentColor.selected", false);
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