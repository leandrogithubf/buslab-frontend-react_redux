import React, { useRef, useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { format } from "date-fns";

import Colors from "../../../assets/constants/Colors";
import { config } from "./config";
import { legendAndMark } from "../shared/templates";
import { useChartApi } from "../shared/hooks/useChartApi";

/* Chart code */
// Themes begin
am4core.useTheme(am4themesAnimated);
// Themes end

function AverageHourlyCompliance({ type = "AverageHourlyCompliance", search }) {
    const x = useRef(null);
    const [data, load] = useChartApi(config[type].apiRoute, search);

    useLayoutEffect(() => {
        if ((load, !data.data)) {
            return;
        }
        const chart = am4core.create(type, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;

        // format API
        const date = new Date();
        const aux = data.data.map(data => {
            const description = format(date.setHours(data.description), "HH:00").toLowerCase();
            return {
                ...data,
                description,
            };
        });

        chart.data = aux;

        // Export
        chart.exporting.menu = new am4core.ExportMenu();

        /* Create axes */
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "description";
        categoryAxis.renderer.minGridDistance = 32;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fill = am4core.color(Colors.C7);
        categoryAxis.renderer.labels.template.fontSize = 12;
        categoryAxis.startLocation = -0.9;

        /* Create value axis */

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        valueAxis.min = 0;
        valueAxis.max = 1000;

        valueAxis.renderer.minGridDistance = 20;
        valueAxis.renderer.grid.template.location = 0;
        valueAxis.renderer.labels.template.fill = am4core.color(Colors.cinzaGrafico);

        valueAxis.renderer.inside = true;
        valueAxis.renderer.maxLabelPosition = 0.99;
        valueAxis.renderer.labels.template.dy = -10;
        valueAxis.numberFormatter.numberFormat = "#  min";

        function createGrid(value) {
            let range = valueAxis.axisRanges.create();
            range.value = value;
            range.label.text = "{value}";
        }
        createGrid(300);

        //Zero change
        // valueAxis.renderer.labels.template.adapter.add("text", (label, target) => {
        //     if (target.dataItem && target.dataItem.value === 0) {
        //         return "pontuais";
        //     } else {
        //         return label;
        //     }
        // });

        const axisBreakHigh = valueAxis.axisBreaks.create();
        axisBreakHigh.startValue = 301;
        axisBreakHigh.endValue = 10000;
        axisBreakHigh.hidden = true;

        /* Create ranges */
        const rangeUp = valueAxis.axisRanges.create();
        rangeUp.value = 0;
        rangeUp.endValue = 10000;
        rangeUp.axisFill.fill = am4core.color(config[type].colors.background.up);
        rangeUp.axisFill.fillOpacity = 0.14;
        rangeUp.label.disabled = true;

        // const range = valueAxis.axisRanges.create();
        // range.value = -5;
        // range.endValue = 5;
        // range.axisFill.fill = am4core.color(config[type].colors.background.middle);
        // range.axisFill.fillOpacity = 1;
        // range.label.disabled = true;

        /* Create line series */
        const lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "Tempo";
        lineSeries.dataFields.valueY = "average";
        lineSeries.dataFields.categoryX = "description";
        lineSeries.stroke = am4core.color(config[type].colors.line);
        lineSeries.strokeWidth = 3;

        lineSeries.tooltipText =
            "[#fff font-size: 15px]{name} médio de: {valueY}\n[/][#fff font-size: 20px][/] às {categoryX}[#fff]{additional}[/]";

        lineSeries.tooltip.label.textAlign = "middle";
        lineSeries.tooltip.pointerOrientation = "vertical";
        lineSeries.tooltip.tooltipPosition = "pointer";

        categoryAxis.renderer.labels.template.tooltipText = "{category}";

        const legend = legendAndMark(chart);

        legend.data = [
            {
                name: config[type].legends.line,
                fill: am4core.color(config[type].colors.line),
            },
        ];
        legend.useDefaultMarker = true;

        chart.cursor = new am4charts.XYCursor();

        x.current = chart;

        //  getData();

        return () => {
            chart.dispose();
        };
    }, [data, load, type]);

    return <div id={type} style={{ width: "100%", height: "350px" }} />;
}
export default AverageHourlyCompliance;
