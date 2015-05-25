import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  paper: null,

  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    events.get('tap').set( {threshold: 10, posThreshold: 20});
    return events;
  }.property("el"),

  enable: function(){
    var events = this.get("events");

    events.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    events.on("panstart", Ember.$.proxy(this.start, this));
    events.on("panmove", Ember.$.proxy(this.move, this));
    events.on("panend", Ember.$.proxy(this.end, this));
  },

  disable: function(){
    var events = this.get("events");
    events.off("panstart");
    events.off("panmove");
    events.off("panend");
  },

  start: function(e){
    var el = this.get("el"),
        paper = this.get("paper"),
        center = e.center,
        point = this.convertPoint( center.x, center.y),
        box;

    el.find(".selector").remove();

    box = paper.rect(point.x, point.y, 5, 5);
    Em.$(box.node).attr("class", "selector");

    this._start = point;
    this._box = box;
    this.highlight(box);
  },

  move: function(e){
    var el = this.get("el"),
        paper = this.get("paper"),
        center = e.center,
        box = this._box,
        point = this.convertPoint( center.x, center.y),
        start = this._start,
        pos = {x: start.x, y:start.y},
        width = point.x - pos.x,
        height = point.y - pos.y;

    if(width < 0){
      pos.x = start.x + width;
      width = -width;
    }

    if(height < 0){
      pos.y = start.y + height;
      height = -height;
    }

    box.attr({
      x: pos.x,
      y: pos.y,
      width: width,
      height: height
    });

    this.highlight(box);
  },

  end: function(e){
    this.select(this.highlight(this._box));
  },

  highlight: function(box){
    var svg = this.get("el").find("svg").get(0),
        highlight,
        intersect,
        selection = [];

    intersect = svg.getIntersectionList(box.node.getBBox(), svg);

    this.clearHighlights();

    Em.$(intersect).each(function(){
      var sel = Em.$(this);
      if (sel.attr("class") == "base" || this.tagName == "rect"){
        return;
      }
      selection.push(sel);
      highlight = sel.clone()
      highlight.attr("class", "highlight");
      highlight.insertBefore(this);

    });
    return selection;
  },

  clearHighlights: function(){
    // clear all other highlight
    var el = this.get("el");
    el.find(".highlight").remove();
  },

  select: function(){
    var el = this.get("el");
    el.find(".selector").remove();
  }
});