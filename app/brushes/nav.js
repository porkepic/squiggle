import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  paper: null,
  
  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    events.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    return events;
  }.property("el"),

  enable: function(){
    // check if there is touch events
    this.get("events").on("panstart", Ember.$.proxy(this.moveStart, this));
    this.get("events").on("panmove", Ember.$.proxy(this.move, this));
  },

  disable: function(){
    this.get("events").off("panstart");
    this.get("events").off("panmove");
  },

  moveStart: function(e){
    this._startViewBox = this.currentViewBox();
    this.move(e);
  },

  move: function(e){
    var box = this._startViewBox,
        paper = this.get("paper"),
        el = this.get("el"),
        width = el.width(),
        height = el.height(),
        x = -e.deltaX + this._startViewBox[0],
        y = -e.deltaY + this._startViewBox[1];

    x = (x < 0 ? 0 : x);
    y = (y < 0 ? 0 : y);

    // do not overflow width
    if(box[2] + Math.abs(x) > width){
      x = width - box[2];
    }

    // do not overflow height
    if(box[3] + Math.abs(y) > height){
      y = height - box[3];
    }

    paper.setViewBox(x, y, box[2], box[3]);
  }
});