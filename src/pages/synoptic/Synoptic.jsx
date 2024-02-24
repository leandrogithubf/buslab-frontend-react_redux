/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import SearchEngine from "../../components/Filter/SearchEngine";
import Title from "../../components/Title";
import TabsGraph from "./components/TapGraph";

const Synoptic = props => {
    const company = JSON.parse(window.localStorage.getItem("session-user-company")) || null;
    const [search, setSearch] = useState({ company: company?.identifier });
    const TabGraphLocal = () => <TabsGraph company={company} search={search} />;

    return (
        <>
            <Title title={"Tempo Real"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    vehicle: true,
                    driver: true,
                    line: true,
                    company: true,
                }}
            />
            <div className="m-6">
                <TabGraphLocal />
            </div>
        </>
    );
};

export default Synoptic;
