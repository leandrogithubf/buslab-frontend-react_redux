import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import Colors from '../../../assets/constants/Colors';

export function legendAndMark(chart) {
  const legend = new am4charts.Legend();
  legend.contentAlign = 'left';
  legend.parent = chart.chartContainer;
  legend.labels.template.fill = am4core.color(Colors.C7);

  // marker
  const marker = legend.markers.template.children.getIndex(0);
  marker.cornerRadius(12, 12, 12, 12);
  marker.width = 18;
  marker.height = 18;

  return legend;
}
