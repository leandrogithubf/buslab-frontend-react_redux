/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import PillColor from "../../../components/PillColor";
import StickerBus from "./StickerBus";

const StatusBus = ({ status: data, qtt }) => {
    const status = Object.values(data).reduce((acc, value) => ({ ...acc, ...value }), {});

    return (
        <>
            <div className="flex flex-wrap justify-between w-full mb-2">
                <PillColor
                    list={[
                        {
                            text: `no horário (${qtt["IN_ROUTE"]?.total})`,
                            color: "bg-azul",
                        },
                        {
                            text: `adiantado (${qtt["IN_ROUTE_EARLY"]?.total})`,
                            color: "bg-amarelo",
                        },
                        {
                            text: `atrasado (${qtt["IN_ROUTE_LATE"]?.total})`,
                            color: "bg-laranja",
                        },
                        {
                            text: `parados no ponto inicial (${qtt["IN_ROUTE_AT_START"]?.total})`,
                            color: "bg-c5",
                        },
                        {
                            text: `parados no ponto final (${qtt["IN_ROUTE_AT_END"]?.total})`,
                            color: "bg-c5",
                        },
                        {
                            text: `fora de operação (${qtt["OFF_ROUTE"]?.total})`,
                            color: "bg-c5",
                        },
                        {
                            text: `em manutenção (${qtt["MAINTENANCE"]?.total})`,
                            color: "bg-c5",
                        },
                    ]}
                />
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">No horário</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="IN_ROUTE" bgColor="bg-buslab" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Adiantados</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="IN_ROUTE_EARLY" bgColor="bg-amarelo" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Atrasados</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="IN_ROUTE_LATE" bgColor="bg-laranja" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Parados no ponto inicial</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="IN_ROUTE_AT_START" bgColor="bg-c6" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Parados no ponto final</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="IN_ROUTE_AT_END" bgColor="bg-c6" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Fora de operação</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="OFF_ROUTE" bgColor="bg-c6" />
                </div>
            </div>
            <div className="mb-10">
                <p className="font-medium mb-1">Em manutenção</p>
                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                    <StickerBus list={status} comparative="MAINTENANCE" bgColor="bg-c6" />
                </div>
            </div>
        </>
    );
};

export default StatusBus;
