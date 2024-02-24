import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

import ReportOne from "./ReportOne";
import ReportThree from "./ReportThree";
import ReportTwo from "./ReportTwo";
import ReportFour from "./ReportFour";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";

const ReportsMain = ({ search, company }) => {
    const [openTabGraph, setOpenTabGraph] = useState(1);

    const companyList = useRef();
    const status = useRef({});

    useEffect(() => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            const companies = {};
            companyList.current = companies;

            response.data.data.forEach(comp => {
                companies[comp.identifier] = { ...comp };
            });
        });
    }, []);

    return (
        <>
            <div className="flex flex-wrap ">
                <div className="w-full">
                    <ul
                        className={`flex list-none flex-wrap flex-row ${
                            openTabGraph === 1 ? "bg-c4" : openTabGraph === 2 ? "bg-c2" : "bg-white"
                        }`}
                        role="tablist">
                        <li>
                            <a
                                className={
                                    "py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 1
                                        ? "bg-white rounded-t"
                                        : openTabGraph === 2
                                        ? "bg-c2 rounded-t"
                                        : "bg-c4 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(1);
                                }}
                                data-toggle="tab"
                                href="#linkOne"
                                role="tablist">
                                Relatórios de monitoramento de frotas
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    " py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 2 ? "bg-white rounded-t" : "bg-c2 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(2);
                                }}
                                data-toggle="tab"
                                href="#linkTwo"
                                role="tablist">
                                Relatórios de fiscalização
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    " py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 3 ? "bg-white rounded-t" : "bg-c3 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(3);
                                }}
                                data-toggle="tab"
                                href="#linkThree"
                                role="tablist">
                                Relatórios de ocorrências operacionais
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    " py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 4 ? "bg-white rounded-t" : "bg-c4 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(4);
                                }}
                                data-toggle="tab"
                                href="#linkFour"
                                role="tablist">
                                Histórico
                            </a>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div
                                    className={openTabGraph === 1 ? "block" : "hidden"}
                                    id="linkOne">
                                    <ReportOne
                                        search={search}
                                    />
                                </div>
                                <div
                                    className={openTabGraph === 2 ? "block" : "hidden"}
                                    id="linkTwo">
                                    <ReportTwo
                                        search={search}
                                    />
                                </div>
                                <div
                                    className={openTabGraph === 3 ? "block" : "hidden"}
                                    id="linkThree">
                                    <ReportThree 
                                        search={search} 
                                    />
                                </div>
                                <div
                                    className={openTabGraph === 4 ? "block" : "hidden"}
                                    id="linkFour">
                                    <ReportFour 
                                        search={search} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ReportsMain;
