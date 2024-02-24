/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import SearchEngine from "../../components/Filter/SearchEngine";
import Title from "../../components/Title";
import ReportsMain from "./components/ReportsMain";

const Reports = props => {
    const company = JSON.parse(window.localStorage.getItem("session-user-company")) || null;
    const [search, setSearch] = useState({ company: company?.identifier });
    const ReportsMainLocal = () => <ReportsMain company={company} search={search} />;

    return (
        <>
            <Title title={"Relatórios"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    period: true,
                    vehicle: true,
                    line:true,
                }}
            />
            <div className="m-6">
                <ReportsMainLocal />
            </div>
        </>
    );
};

export default Reports;
