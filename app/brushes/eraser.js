import Ember from "ember";
import Select from "./select";

export default Select.extend({
  select: function(e){
    if(this._selection == e.target){
      // check for i18n
      var message = "Do you want to delete this note?";
      if(Ember.I18n){
        message = Ember.I18n.t("squiggle.erase_confirm");
      }
      if(confirm(message)){
        Ember.$(e.target).remove();
        this.get("el").find(".highlight,.highlight-select,.text-highlight,.text-highlight-select").remove();
      }
    }else{
      this._super(e);  
    }
  }
});