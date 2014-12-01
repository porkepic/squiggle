import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  paper: null,
  
  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    events.get('pinch').set({ enable: true });
    return events;
  }.property("el"),

  currentViewBox: function(){
    var svg = this.get("el").find("svg");
    return svg[0].getAttribute("viewBox").split(" ").map(function(v){
      return +v;
    });
  },

  enable: function(){
    var svg = this.get("el").find("svg");

    // check if there is touch events
    if("ontouchstart" in window){
      this.get("events").on("pinchstart", Ember.$.proxy(this.pinchStart, this));
      this.get("events").on("pinchmove", Ember.$.proxy(this.pinchZoom, this));
    }else{
      svg.on("mousewheel", Ember.$.proxy(this.scrollZoom, this));
    }

    this._zoom = 1;
    this._originalViewbox = this.currentViewBox();
  },

  disable: function(){
    this.get("events").off("pinch");
    this.get("el").find("svg").off("mousewheel");
  },

  scrollZoom: function(e){
    var delta = e.originalEvent.deltaY,
        pt = this.convertPoint(e.clientX, e.clientY),
        factor = delta < 0 ? 0.95 : 1.05;

    this.zoom(pt, factor);
    e.preventDefault();
  },

  pinchStart: function(e){
    this._pinchStartBox = this.currentViewBox();
    this.pinchMove(e);
  },

  pinchZoom: function(e){
    // put the scale back into acceptable range.
    var pt = this.convertPoint(e.center.x, e.center.y),
        scale = ((e.scale - 1) * 0.1) + 1;

    this.zoom(pt, scale, this._pinchStartBox);
  },

  zoom: function(location, factor, box) {
    if(!box){
      box = this.currentViewBox();
    }
    //transform real coordinates into viewbox coordinates
    var x =  box[0] + (location.x / this._zoom),
        y =  box[1] + (location.y / this._zoom),
        paper = this.get("paper"),
        zoom;

      zoom = (this._zoom * factor);
      if(zoom < 1){
        zoom = 1;
      }
      this._zoom = zoom;

      //zoom viewbox dimensions
      box[2] = this._originalViewbox[2] / zoom;
      box[3] = this._originalViewbox[3] / zoom;
      
      //transform coordinates to new box coordinates
      box[0] = x - location.x / zoom;
      box[1] = y - location.y / zoom;

      box[0] = (box[0] < 0 ? 0 : box[0]);
      box[1] = (box[1] < 0 ? 0 : box[1]);

      // do not overflow width
      if(box[2] + Math.abs(box[0]) > this._originalViewbox[2]){
        box[0] = this._originalViewbox[2] - box[2];
      }

      // do not overflow height
      if(box[3] + Math.abs(box[1]) > this._originalViewbox[3]){
        box[1] = this._originalViewbox[3] - box[3];
      }
      
      paper.setViewBox.apply(paper, box, true);
  }
});