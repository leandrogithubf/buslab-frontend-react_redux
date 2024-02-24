import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4lang_pt_BR from "@amcharts/amcharts4/lang/pt_BR";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { ClipLoader } from "react-spinners";

import { legendAndMark } from "../shared/templates";
import { useChartApi } from "../shared/hooks/useChartApi";
import { config } from "./config";

// Themes begin
am4core.useTheme(am4themesAnimated);
// Themes end

function TimeTrip({ type = "timeTrip", search }) {
    const x = useRef(null);
    const [data, load] = useChartApi(config[type].apiRoute, search);

    useLayoutEffect(() => {
        if (load) {
            return;
        }
        const chart = am4core.create(type, am4charts.XYChart);
        chart.language.locale = am4lang_pt_BR;
        chart.data = data;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        // Export
        chart.exporting.menu = new am4core.ExportMenu();

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);

        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "day";
        categoryAxis.renderer.minGridDistance = 35;
        categoryAxis.renderer.labels.template.fontSize = 12.5;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 6;
        valueAxis.min = 0;
        valueAxis.max = 100;

        function createSeries(field) {
            const series = chart.series.push(new am4charts.ColumnSeries());
            series.columns.template.width = am4core.percent(80);
            series.columns.template.tooltipText =
                "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
            series.name = "dentro da média";
            series.dataFields.categoryX = "day";
            series.dataFields.valueY = field;
            //  series.dataFields.valueYShow = "totalPercent";
            series.dataItems.template.locations.categoryX = 0.5;
            series.stacked = true;
            series.tooltip.pointerOrientation = "vertical";

            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 0;
            columnTemplate.strokeOpacity = 0;
            columnTemplate.maxWidth = 18;
            columnTemplate.tooltipText = "{valueY.totalPercent.formatNumber('#.00')}%";
            columnTemplate.fill = am4core.color(config[type].colors[field]);
        }

        createSeries("punctualityIndexPercent");

        // legend
        const legend = legendAndMark(chart);

        legend.data = [
            {
                name: config[type].legends.punctualityIndexPercent,
                fill: am4core.color(config[type].colors.punctualityIndexPercent),
            },
        ];

        chart.scrollbarX = new am4core.Scrollbar();

        x.current = chart;
        return () => {
            chart.dispose();
        };
    }, [data, load, type]);

    return (
        <>
            {load && <ClipLoader size={20} loading={load} />}
            <div id={type} style={{ width: "100%", height: "460px" }} />
        </>
    );
}

export default TimeTrip;
