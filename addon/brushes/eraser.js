import Ember from "ember";
import Select from "./select";

export default Select.extend({
  name: "squiggle-eraser",
  select: function(intersect){
    this._super(intersect);

    if(intersect.length > 0){
      var message = "Do you want to delete this selection?";
      if(Ember.I18n){
        message = Ember.I18n.t("squiggle.erase_confirm");
      }

      if(confirm(message)){
        Em.$(intersect).each(function(){
          Em.$(this).remove();
        });
      }
    }
    this.clearHighlights();
  }
});