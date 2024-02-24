import React, { useState } from "react";

import Collapse from "../../../../components/Collapse";
import GarageTable from "./GarageTable";
import SocketTable from "./SocketTable";

const Collapsible = ({ status, itineraries }) => {
    const [openCollapsible, setOpenCollapsible] = useState("");

    return (
        <div className="mt-4">
            <Collapse
                title={`Ônibus em rota`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="IN_ROUTE" status={status} />
            </Collapse>
            <Collapse
                title={`Fora de rota`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="OFF_ROUTE" status={status} />
            </Collapse>
            <Collapse
                title={`Ônibus adiantados`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="IN_ROUTE_EARLY" status={status} />
            </Collapse>
            <Collapse
                title={`Ônibus atrasados`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="IN_ROUTE_DELAYED" status={status} />
            </Collapse>
            <Collapse
                title={`Ônibus parados no ponto inicial`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="START_POINT" status={status} />
            </Collapse>
            <Collapse
                title={`Ônibus parados no ponto final`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <SocketTable type="END_POINT" status={status} />
            </Collapse>
            <Collapse
                title={`Ônibus na garagem`}
                openCollapse={openCollapsible}
                setOpenCollapse={setOpenCollapsible}>
                <GarageTable status={status} itineraries={itineraries} />
            </Collapse>
        </div>
    );
};
export default Collapsible;
