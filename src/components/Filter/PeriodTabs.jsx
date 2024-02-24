import React, { useEffect, useState } from "react";
import { subDays } from "date-fns";

import { DatePickerMultiple } from "../Date/DatePickerMultiple";
import { DatePickerPeriod } from "../Date/DatePickerPeriod";
import { LabelFullDefault } from "../Details";

const PeriodTabs = ({ color, period, setPeriod, openTabTime, setOpenTabTime }) => {
    const [multiple, setMultiple] = useState([]);
    const days = [7, 15, 30];
    const init = tab => ({
        ...period,
        startsAt: subDays(new Date(), days[tab - 1]),
        endsAt: new Date(),
        sequence: [],
    });

    useEffect(() => {
        setPeriod(init(openTabTime));
    }, []);

    return (
        <>
            <div className="flex flex-wrap mb-0">
                <div className={`w-full md:w-full lg:w-1/2`}>
                    <ul className="flex mb-0 ml-2 list-none flex-wrap pb-4 flex-row" role="tablist">
                        <li className="-ml-2 flex-auto text-center">
                            <a
                                className={
                                    "text-sm font-medium  px-5 py-3 border-2 border-gray-200 block leading-normal " +
                                    (openTabTime === 1
                                        ? "text-white bg-" + color
                                        : "text-c7-14 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabTime(1);
                                    setPeriod({
                                        startsAt: subDays(new Date(), 7),
                                        endsAt: new Date(),
                                        sequence: [],
                                    });
                                    setMultiple([]);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist">
                                7 dias
                            </a>
                        </li>
                        <li className="-ml-2 flex-auto text-center">
                            <a
                                className={
                                    "text-sm font-medium  px-5 py-3 border-2 border-gray-200 block leading-normal " +
                                    (openTabTime === 2
                                        ? "text-white bg-" + color
                                        : "text-c7-14 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabTime(2);
                                    setPeriod({
                                        startsAt: subDays(new Date(), 15),
                                        endsAt: new Date(),
                                        sequence: [],
                                    });
                                    setMultiple([]);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist">
                                15 dias
                            </a>
                        </li>
                        <li className="-ml-2 flex-auto text-center">
                            <a
                                className={
                                    "text-sm font-medium  px-5 py-3 border-2 border-gray-200 block leading-normal " +
                                    (openTabTime === 3
                                        ? "text-white bg-" + color
                                        : "text-c7-14 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabTime(3);
                                    setPeriod({
                                        startsAt: subDays(new Date(), 30),
                                        endsAt: new Date(),
                                        sequence: [],
                                    });
                                    setMultiple([]);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist">
                                30 dias
                            </a>
                        </li>
                        <li className="-ml-2 flex-auto text-center">
                            <a
                                className={
                                    "text-sm font-medium  px-5 py-3 border-2 border-gray-200  block leading-normal " +
                                    (openTabTime === 4
                                        ? "text-white bg-" + color
                                        : "text-c7-14 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setPeriod({ ...period, sequence: [] });
                                    setMultiple([]);
                                    setOpenTabTime(4);
                                }}
                                data-toggle="tab"
                                href="#link5"
                                role="tablist">
                                outro periodo
                            </a>
                        </li>
                        <li className="-ml-2 flex-auto text-center">
                            <a
                                className={
                                    "text-sm font-medium  px-5 py-3 border-2 border-gray-200  block leading-normal " +
                                    (openTabTime === 5
                                        ? "text-white bg-" + color
                                        : "text-c7-14 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabTime(5);
                                }}
                                data-toggle="tab"
                                href="#link6"
                                role="tablist">
                                datas não sequenciais
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={`w-full md:w-full lg:w-1/2`}>
                    <div className="flex flex-col min-w-0 break-words bg-white w-full">
                        <div className="px-4 flex-auto">
                            <div className="tab-content tab-space sm:mt-2 sm:mb-4 lg:-mt-6">
                                {openTabTime === 4 && (
                                    <div id="link5">
                                        <LabelFullDefault description="Especifique um periodo" />
                                        <div className="flex self-center">
                                            <label className="text-14 text-c7-14 font-medium mr-2 self-center">
                                                De:
                                            </label>
                                            <DatePickerPeriod
                                                name="start"
                                                selected={new Date(period.startsAt)}
                                                onChange={select =>
                                                    setPeriod({
                                                        ...period,
                                                        startsAt: select,
                                                    })
                                                }
                                                calendarPopperPosition="bottom"
                                            />
                                            <label className="text-14 text-c7-14 font-medium mr-2 ml-2 self-center">
                                                Até:
                                            </label>
                                            <DatePickerPeriod
                                                name="end"
                                                selected={new Date(period.endsAt || "")}
                                                onChange={select => {
                                                    setPeriod({
                                                        ...period,
                                                        endsAt: select,
                                                    });
                                                }}
                                                calendarPopperPosition="bottom"
                                            />
                                        </div>
                                    </div>
                                )}
                                {openTabTime === 5 && (
                                    <div id="link6">
                                        <LabelFullDefault description="Escolha as datas desejadas" />
                                        <DatePickerMultiple
                                            selected={multiple}
                                            onChange={select => {
                                                setPeriod({
                                                    ...period,
                                                    sequence: select.map(
                                                        ({ day, month, year }) =>
                                                            `${year}-${month}-${day}`
                                                    ),
                                                });
                                                setMultiple(select);
                                            }}
                                            value={multiple.map(
                                                date => ` ${date.day}/${date.month}/${date.year}`
                                            )}
                                            calendarPopperPosition="bottom"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PeriodTabs;
