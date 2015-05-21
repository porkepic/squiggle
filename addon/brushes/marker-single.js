import Marker from "./marker";

export default Marker.extend({
  name: "markerSingle",
  start: function(e){
    // remove all previous paths
    this.get("el").find("circle").remove();
    this._super(e);

  }

})