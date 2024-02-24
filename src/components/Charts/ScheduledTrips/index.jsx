import React, { useRef, useLayoutEffect, useCallback, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import am4langPTBR from "@amcharts/amcharts4/lang/pt_BR";

import Colors from "../../../assets/constants/Colors";
import { ClipLoader } from "react-spinners";
import { useChartApi } from "../shared/hooks/useChartApi";

am4core.useTheme(am4themesAnimated);

const ScheduledTrips = () => {
    const x = useRef(null);
    const [search] = useState({});
    const [data, load] = useChartApi(`api/dashboard/trips`, search);

    const formatData = useCallback(
        chart => {
            const trips = data;
            // Label name
            const aux = Object.keys(trips).reduce((acc, field) => {
                let newField;
                switch (field) {
                    case "today":
                        newField = "Hoje";
                        break;
                    case "yesterday":
                        newField = "Ontem";
                        break;
                    case "week":
                        newField = "Essa Semana";
                        break;
                    case "month":
                        newField = "Mês";
                        break;
                    default:
                        newField = null;
                }

                if (!newField) return acc;

                // Total on label
                const total = Object.values(trips[field])
                    .filter(value => Number(value))
                    .reduce((acc, value) => (acc += value < 0 ? 0 : value), 0);

                acc.push({
                    category: `${newField} (${total})`,
                    ...trips[field],
                    NOT_DONE: trips[field].NOT_DONE < 0 ? 0 : trips[field].NOT_DONE,
                });
                return acc;
            }, []);
            chart.data = aux;
        },
        [data]
    );

    useLayoutEffect(() => {
        if (load) {
            return;
        }
        const chart = am4core.create("scheduledTrips", am4charts.XYChart);
        chart.language.locale = am4langPTBR;

        formatData(chart);

        // Create axes
        const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = "category";
        yAxis.renderer.opposite = true;
        yAxis.renderer.labels.template.fontSize = 13;
        yAxis.renderer.labels.template.fill = am4core.color(Colors.C7);

        const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
        xAxis.min = 0;
        xAxis.max = 100;
        xAxis.strictMinMax = true;
        xAxis.calculateTotals = true;
        xAxis.renderer.minHeight = 40;
        xAxis.renderer.disabled = true;
        xAxis.renderer.grid.template.disabled = true;

        // Create series
        function createSeries(field, name, color) {
            const series = chart.series.push(new am4charts.ColumnSeries());

            series.name = name || field;
            series.dataFields.categoryY = "category";
            series.dataFields.valueX = field;
            series.dataFields.valueXShow = "totalPercent";
            series.columns.template.height = 15;
            series.columns.template.tooltipText = "{name}: {valueX}";
            series.columns.template.fill = am4core.color(color);
            series.columns.template.strokeOpacity = 0.15;
            series.stacked = true;
            series.tooltip.pointerOrientation = "vertical";
            series.bullets.push(new am4charts.LabelBullet());

            chart.maskBullets = false;
            chart.paddingLeft = 30;
        }

        createSeries("DONE", "concluídas pontualmente", "#2fb5b1");
        createSeries("DONE_LATE", "concluídas com atraso", "#ffd068");
        createSeries("DONE_EARLY", "concluídas adiantadamente", "#e6e6e6");
        createSeries("NOT_DONE", "não realizadas", "#e65250");

        x.current = chart;

        return () => {
            chart.dispose();
        };
    }, [formatData, load]);

    return (
        <>
            {load && <ClipLoader size={20} color={Colors.buslab} />}
            <div id="scheduledTrips" style={{ width: "100%", height: "300px" }} />
        </>
    );
};

export default ScheduledTrips;
