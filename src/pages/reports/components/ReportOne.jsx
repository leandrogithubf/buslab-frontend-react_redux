/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import ButtonIconTextYellow from "../../../components/Buttons/yellow/ButtonIconTextYellow";
import ButtonIconTextRed from "../../../components/Buttons/red/ButtonIconTextRed";
import ButtonIconTextDefault from "../../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosCloudDownload } from "react-icons/io";
import { Label, Information, Pencil, LoadSave, Save, AddOutline } from "../../../components/Details";
import { fileDownload } from "../../../services/requests";

const ReportOne = ({ search }) => {
    let [activeEdit, setActiveEdit] = useState();
    const [line, setLine] = useState();
    const setInputActive = value => {
        setActiveEdit(value);
    };

    useEffect(() => {
        if (search.line) {
            api.get(`/api/adm/line/${search.line}/points`, HeaderToken())
                .then(response => {
                    setLine(response.data);
                })
                .catch(error => {
                    Interceptor(error);
                });
        }
    }, [search]);
    return (
        <>
            <div className="text-right">
            
            </div>
            <section style={{ height: "600px" }}>
                {/* <iframe src={'arquivo.pdf'} width="100%" height="95%" type='application/pdf'></iframe> */}
            <div className="flex flex-wrap">
                <div className="xs:w-full sm:w-full md:w-1/3 lg:w-1/3 pr-4">
                    <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                        <Label description="1" />
                        <div className="flex justify-between w-2/3">Totalização de frota
                            <AddOutline setInputActive={() => setInputActive("company")} />
                        </div>
                    </div>
                    <div className="sm:w-full xs:w-full flex justify-center items-center">
                        <Label description="Relatório" />
                        <div className="flex justify-between w-2/3">2
                            <Pencil setInputActive={() => setInputActive("model")} />
                        </div>
                    </div>
                    <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                        <Label description="Relatório" />
                        <div className="flex justify-between w-2/3">3
                            <Pencil setInputActive={() => setInputActive("manufacture")} />
                        </div>
                    </div>
                    <div className="sm:w-full xs:w-full flex justify-center items-center">
                        <Label description="Relatório" />
                        <div className="flex justify-between w-2/3">4
                            <Pencil setInputActive={() => setInputActive("prefix")} />
                        </div>
                    </div>
                    <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                        <Label description="Relatório" />
                        <div className="flex justify-between w-2/3">5
                            <Pencil setInputActive={() => setInputActive("plate")} />
                        </div>
                    </div>
                    <div className="sm:w-full xs:w-full flex justify-center items-center">
                        <Label description="Relatório" />
                        <div className="flex justify-between w-2/3">6
                            <Pencil setInputActive={() => setInputActive("chassi")} />
                        </div>
                    </div>
                </div>
                <div className="xs:w-full sm:w-full md:w-2/3 lg:w-2/3 pl-4 ">
                    <div className="sm:w-full xs:w-full flex justify-right items-center border-double">
                    </div>
                    <div className="sm:w-full xs:w-full flex justify-center items-center border-double">
                        <object width="900" height="500" data="http://localhost:8000/assets/pdf/total_frota-10-11-2021 12:53:41.pdf" type="application/pdf">   </object>
                    </div>
                    <div className="text-right ">
                        <ButtonIconTextDefault
                            title={"CSV"}
                            // onClick={actionModalPost}
                            icon={<IoIosCloudDownload />}
                        />
                        <ButtonIconTextYellow
                            title={"XLS"}
                            // onClick={actionModalPost}
                            icon={<IoIosCloudDownload />}
                        />
                        {/* <ButtonIconTextRed */}
                            {/* title={"PDF"}
                            icon={<IoIosCloudDownload />} */}
                        {/* /> */}
                    </div>
                </div>
            </div>
            </section>
            <hr />
        </>
    );
};
export default ReportOne;
