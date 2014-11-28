import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,

  enable: function(){
    var el = this.get("el"),
        selection = el.find("div, path:not(.highlight)");
    selection.on("mouseenter", Ember.$.proxy(this.highlight, this));
    selection.on("mouseleave", Ember.$.proxy(this.clearHighlights, this));
    selection.on("click", Ember.$.proxy(this.select, this));
  },

  disable: function(){
    var el = this.get("el"),
        selection = el.find("div, path:not(.highlight)");

    selection.off("mouseenter");
    selection.off("mouseleave");
    selection.off("click");
  },

  highlight: function(e){
    var target = Ember.$(e.target),
        el = this.get("el"),
        highlight;

    this.clearHighlights();

    if(e.target.tagName == "DIV"){
      target.addClass("text-highlight");
    }else{
      // for paths
      highlight = target.clone()
      highlight.attr("class", "highlight");
      highlight.insertBefore(target);
    }
  },

  clearHighlights: function(e){
    // clear all other highlight
    var el = this.get("el");
    el.find(".highlight").remove();
    el.find(".text-highlight").removeClass("text-highlight");
  },

  select: function(e){
    var target = Ember.$(e.target),
        el = this.get("el"),
        highlight;

    this.clearHighlights();

    el.find(".highlight-select").remove();
    el.find(".text-highlight-select").removeClass("text-highlight-select");

    this._selection = e.target;

    if(e.target.tagName == "DIV"){
      target.addClass("text-highlight-select");
    }else{
      // for paths
      highlight = target.clone()
      highlight.attr("class", "highlight-select");
      highlight.insertBefore(target);
    }
  }
}); 