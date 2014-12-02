import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,

  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    return events;
  }.property("el"),

  enable: function(){
    var el = this.get("el"),
        selection = el.find("text:not(.highlight), path:not(.highlight)");
    if(!( "ontouchstart" in window)){
      selection.on("mouseenter", Ember.$.proxy(this.highlight, this));
      selection.on("mouseleave", Ember.$.proxy(this.clearHighlights, this));
    }
    this.get("events").on("tap", Ember.$.proxy(this.select, this));
  },

  disable: function(){
    var el = this.get("el"),
        selection = el.find("text:not(.highlight), path:not(.highlight)");

    selection.off("mouseenter");
    selection.off("mouseleave");
    this.get("events").off("tap");
  },

  highlight: function(e){
    var target = Ember.$(e.target),
        el = this.get("el"),
        highlight;

    this.clearHighlights();

    highlight = target.clone()
    highlight.attr("class", "highlight");
    highlight.insertBefore(target);
  },

  clearHighlights: function(e){
    // clear all other highlight
    var el = this.get("el");
    el.find(".highlight").remove();
  },

  select: function(e){
    var target = Ember.$(e.target),
        el = this.get("el"),
        highlight;

    this.clearHighlights();

    el.find(".highlight-select").remove();

    this._selection = e.target;

    highlight = target.clone()
    highlight.attr("class", "highlight-select");
    highlight.insertBefore(target);
  }
}); 