import React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Field } from "formik";

import { DatePickerPeriod } from "../../../Date/DatePickerPeriod";
import { Content } from "./styles";
import { LabelFullDefault } from "../../../Details";
import CardSelect from "../CardSelect";

function CalendarAndHour({ period, setPeriod }) {
    function handleChange(e) {
        if (e instanceof Date) {
            setPeriod({
                ...period,
                startsAt: period.startsAt
                    ? new Date(format(e, "yyyy-MM-dd ") + format(period.startsAt, "HH:mm"))
                    : e,
                endsAt: period.endsAt
                    ? new Date(format(e, "yyyy-MM-dd ") + format(period.endsAt, "HH:mm"))
                    : setMinutes(setHours(e, 23), 59),
            });
        } else {
            const { name, value } = e.target;
            if (!(period.startsAt instanceof Date)) {
                period.startsAt = new Date();
            }

            if (name === "startsAt") {
                setPeriod({
                    ...period,
                    startsAt: new Date(format(period.startsAt, "yyyy-MM-dd ") + value),
                });
            } else {
                setPeriod({
                    ...period,
                    endsAt: new Date(format(period.startsAt, "yyyy-MM-dd ") + value),
                });
            }
        }
    }
    return (
        <Content>
            <CardSelect
                children={
                    <>
                        <LabelFullDefault description="Data" />

                        <DatePickerPeriod
                            selected={period.startsAt}
                            onChange={e => handleChange(e)}
                            period={period.startsAt}
                            calendarPopperPosition="bottom"
                        />
                    </>
                }
            />
            <article>
                <LabelFullDefault description="Início" />
                <Field
                    type="time"
                    onChange={e => handleChange(e)}
                    name="startsAt"
                    value={period.startsAt && format(period.startsAt, "HH:mm")}
                    className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9"
                />
            </article>

            <article>
                <LabelFullDefault description="Fim" />
                <Field
                    type="time"
                    onChange={e => handleChange(e)}
                    name="endsAt"
                    value={period.endsAt && format(period.endsAt, "HH:mm")}
                    className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9"
                />
            </article>
        </Content>
    );
}

export default CalendarAndHour;
