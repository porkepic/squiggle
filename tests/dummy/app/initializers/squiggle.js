import BaseBrush from "squiggle/brushes/base";
import PathBrush from "squiggle/brushes/path";
import PolygonBrush from "squiggle/brushes/polygon";
import TextBrush from "squiggle/brushes/text";
import EraseBrush from "squiggle/brushes/eraser";
import NavBrush from "squiggle/brushes/nav";
import MarkerBrush from "squiggle/brushes/marker";
import MarkerSingleBrush from "squiggle/brushes/marker-single";

var initialize = function(container){
  var config = [
    EraseBrush,
    NavBrush,
    PathBrush,
    PolygonBrush,
    TextBrush,
    MarkerBrush,
    MarkerSingleBrush,
    BaseBrush
  ];

  container.register('squiggle:tools', config, {instantiate: false, singleton: true});
};

var Initializer = {
  name: 'routes-scroll',
  initialize: initialize
}

export {initialize}
export default Initializer


