import React, { useRef, useLayoutEffect, useCallback, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4lang_pt_BR from "@amcharts/amcharts4/lang/pt_BR";

import { config } from "./config";
import Colors from "../../../assets/constants/Colors";
import { legendAndMark } from "../shared/templates";
import { useChartApi } from "../shared/hooks/useChartApi";
import { ClipLoader } from "react-spinners";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

function HeatMap({ type = "averageConsumption", search }) {
    const x = useRef(null);
    const [data, load] = useChartApi(config[type].apiRoute, search);

    const getHeatColor = useCallback(
        ({ value, average, percent = 0.15 }) => {
            if (value && average) {
                if (value < average * (1 - percent)) {
                    return am4core.color(config[type].colors.great);
                } else if (value > average * (1 + percent)) {
                    return am4core.color(config[type].colors.bad);
                } else {
                    return am4core.color(config[type].colors.good);
                }
            }
            return am4core.color("rgba(0, 0, 0, 0)");
        },
        [type]
    );

    useLayoutEffect(() => {
        if (load) {
            return;
        }
        const chart = am4core.create(type, am4charts.XYChart);
        chart.language.locale = am4lang_pt_BR;
        chart.data = data.reduce(
            (acc, res) => [
                ...acc,
                ...res.times.map(t => ({
                    hour: `${
                        t[0].split(":")[0] < 10 ? "0" + t[0].split(":")[0] : t[0].split(":")[0]
                    }:00-${
                        Number(t[0].split(":")[0]) + 2 < 10
                            ? "0" + (Number(t[0].split(":")[0]) + 2)
                            : Number(t[0].split(":")[0]) + 2 === 24
                            ? "00"
                            : Number(t[0].split(":")[0]) + 2
                    }:00`,
                    day: res.description,
                    value: t[1],
                    average: res.average,
                })),
            ],
            []
        );

        // Export
        chart.exporting.menu = new am4core.ExportMenu();
        chart.maskBullets = false;

        const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = "day";
        yAxis.dataFields.category = "hour";

        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 35;
        xAxis.renderer.labels.template.fontSize = 12.5;

        xAxis.renderer.labels.template.fill = am4core.color(Colors.C7);

        yAxis.renderer.grid.template.disabled = false;
        yAxis.renderer.minGridDistance = 5;
        yAxis.renderer.grid.template.location = 0;
        yAxis.renderer.labels.template.fill = am4core.color(Colors.cinzaGrafico);

        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "day";
        series.dataFields.categoryY = "hour";
        series.dataFields.value = "value";

        series.sequencedInterpolation = true;
        series.defaultState.transitionDuration = 3000;

        const columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 0;
        columnTemplate.strokeOpacity = 0;
        columnTemplate.tooltipText = "{day} {hour}  \n média: {value} Km/L";
        columnTemplate.maxWidth = 18;
        columnTemplate.height = am4core.percent(101);

        // legend
        const legend = legendAndMark(chart);

        columnTemplate.column.adapter.add("fill", function (fill, target) {
            if (target.dataItem) {
                return getHeatColor(target.dataItem?.dataContext);
            }
            return fill;
        });

        legend.data = [
            {
                name: config[type].legends.great,
                fill: am4core.color(config[type].colors.great),
            },
            {
                name: config[type].legends.good,
                fill: am4core.color(config[type].colors.good),
            },
            {
                name: config[type].legends.bad,
                fill: am4core.color(config[type].colors.bad),
            },
        ];

        x.current = chart;
        return () => {
            chart.dispose();
        };
    }, [data, getHeatColor, load, type]);

    return (
        <>
            {load && <ClipLoader size={20} />}
            <div id={type} style={{ width: "100%", height: "460px" }}></div>
        </>
    );
}

export default HeatMap;
