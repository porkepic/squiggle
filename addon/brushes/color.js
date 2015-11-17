import Ember from "ember";

export default Ember.Object.extend({
  color: null,
  style: function(){
    var color = this.get("color");
    return ["background-color:", ";"].join(color).htmlSafe();
  }.property("color")
});