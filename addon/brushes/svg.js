import Ember from "ember";
import Select from "./select";

export default Select.extend({
  name: "squiggle-svg",
  buttonTemplate: "components/svg-brush",
  highlight: Em.K,
  image: "ouverture-pontage.svg",
  end: function(e){
    var paper = this.get("paper"),
        box = this._box,
        x = box.attr("x"),
        y = box.attr("y"),
        w = box.attr("width"),
        h = box.attr("height");

    // add the image
    paper.image(this.get("image"), x, y, w, h);

    this.select();
  }
});