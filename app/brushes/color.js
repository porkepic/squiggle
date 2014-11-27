import Ember from "ember";

export default Ember.Object.extend({
  color: null,
  style: function(){
    return "background-color:" + this.get("color") + ";"
  }.property("color")
});