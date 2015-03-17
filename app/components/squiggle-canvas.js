import Ember from "ember";
import BaseBrush from "../brushes/base";
import PathBrush from "../brushes/path";
import TextBrush from "../brushes/text";
import EraseBrush from "../brushes/eraser";
import ZoomBrush from "../brushes/zoom";
import NavBrush from "../brushes/nav";
import Color from "../brushes/color";

export default Ember.Component.extend({
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

  toolClass: function(){
    return "squiggle-canvas-" + this.get("toolName");
  }.property("toolName"),

  selectedToolClass: function(){
    return "squiggle-" + this.get("toolName");
  }.property("toolName"),

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

  zoom: function(){
    return ZoomBrush.create({
      paper: this._raphael,
      el: this.$(".squiggle-paper")
    });
  }.property(),

  eraserTool: function(){
    return EraseBrush.create({
      el: this.$(".squiggle-paper")
    })
  }.property(),

  pathTool: function(){
    console.log("reload pathTool")
    return PathBrush.create({
      paper: this._raphael,
      shapes: this._shapes,
      el: this.$(".squiggle-paper")
    })
  }.property(),

  textTool: function(){
    return TextBrush.create({
      paper: this._raphael,
      el: this.$(".squiggle-paper")
    })
  }.property(),

  selectTool: function(){
    return SelectBrush.create({
      el: this.$(".squiggle-paper")
    })
  }.property(),

  navTool: function(){
    return NavBrush.create({
      paper: this._raphael,
      el: this.$(".squiggle-paper")
    });
  }.property(),

  toolName: "path",
  tool: function(){
    var tool = this.get("toolName");
    return this.get(tool + "Tool");
  }.property("toolName", "pathTool", "eraserTool", "textTool", "navTool", "selectTool"),

  isEraserTool: Ember.computed.equal("toolName", "eraser"),
  isPathTool: Ember.computed.equal("toolName", "path"),
  isTextTool: Ember.computed.equal("toolName", "text"),
  isSelectTool: Ember.computed.equal("toolName", "select"),
  isNavTool: Ember.computed.equal("toolName", "nav"),

  color: function(){
    return this.get("colors").findProperty("selected", true);
  }.property("colors.@each.selected"),

  textStyle: function(){
    return ["color:", this.get("color.color"),
    ";font-size:", this.get("smallSize") ? "14px": "24px", ";"].join("");
  }.property("color", "smallSize"),

  didInsertElement: function(){
    var exporter = this.get("exporter");
    if(this.get("image")){
      this.$("img").on("load", Ember.$.proxy(this.createRaphael, this));
    } else {
      this.createRaphael();
    }
    if(exporter) exporter.set("squiggle", this);
  },

  createRaphael: function(){
    var that = this,
        width = this.$().width(),
        height = this.$().height();
    this.$(".squiggle-paper svg").remove();
    this._raphael = Raphael(this.$(".squiggle-paper")[0], width, height);
    this._shapes = [];

    this.notifyPropertyChange("eraserTool");
    this.notifyPropertyChange("pathTool");
    this.notifyPropertyChange("textTool");
    this.notifyPropertyChange("selectTool");
    this.notifyPropertyChange("navTool");

    this.get("tool").enable();
    this.configureTool();

    this._raphael.setViewBox(0,0, width, height);

    this._raphael.image(this.get("image"), 0,0, width, height);

    Ember.$(window).on("resize", function(){
      Ember.run.debounce(that, "changeSize", 100);
    });

    this.get("zoom").enable();
  },

  configureTool: function(){
    var tool = this.get("tool");
    tool.set("brushColor", this.get("color.color"));
    tool.set("brushWidth", this.get("smallSize") ? 4 : 8);
    tool.set("fontSize", this.get("smallSize") ? 14 : 24);
  }.observes("tool", "color", "smallSize"),

  changeSize: function(){
    this._raphael.setSize(this.$().width(),this.$().height());
  },

  // To upload follow http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  exportToPng: function(){
    var img = this.get("image"),
        canvas = this.$("canvas")[0],
        context = canvas.getContext("2d"),
        svg = this.$("svg").clone(),
        svgImg = new Image(),
        url, promise,
        that = this;

    promise = new Ember.RSVP.Promise(function(resolve, reject){
      try {
        if(img){
          img = that.$("img")[0];
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          svg.attr("width", canvas.width);
          svg.attr("height", canvas.height);

          context.drawImage(img, 0, 0);

        }else{
          canvas.width = that.$().width();
          canvas.height = that.$().height();
        }
        url = "data:image/svg+xml," + svg[0].outerHTML;

        svgImg.onload = function () {
          context.drawImage(svgImg, 0, 0);
          resolve(canvas.toDataURL());
        }
        svgImg.onError = reject;
        svgImg.src = url;
      } catch(e){
        reject(e);
      }
    });

    return promise;
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
        this.get("tool").disable();
        this.set("toolName", tool);
        this.get("tool").enable();
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