import dashboardOpts from './dashboard_options.js';

export default (dimensionSet) => {
  var colorAry = [dashboardOpts["chartOpts"]["colors"]["inverseColor"]];

  dashboardOpts["chartOpts"]["colors"]["activeColors"].some(function(color) {
    var isColor = color.condition(dimensionSet[1]);

    if (isColor) {
      colorAry.push(color.value);
      return true;
    }
  });

  return colorAry
}
