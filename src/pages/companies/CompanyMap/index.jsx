import React, { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import Colors from "../../../assets/constants/Colors";

import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import GoogleMaps from "../../../components/Maps/GoogleMaps";
import { Menu } from "./styles";

function CompanyMap({ company, setData, data, setActionFence }) {
    const [points, setPoints] = useState([company]);
    const [draw, setDraw] = useState(false);

    useEffect(() => {
        if (points) {
            const aux = points.map(p => ({ ...p, prefix: company.name }));
            setPoints([...aux]);
        }
    }, []);

    return (
        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-2/3 lg:pl-4">
            <ButtonDefault
                title={draw ? "Click aqui para desistir" : "Adicionar marcação de cerca"}
                type="button"
                className="w-full"
                onClick={() => {
                    setData({ ...data, temp: [] });
                    setDraw(!draw);
                }}
            />
            {points && (
                <div className="relative h-full">
                    <GoogleMaps
                        points={points}
                        areas={data}
                        setAreas={setData}
                        type="draw"
                        draw={draw}
                    />
                    {data.temp && (
                        <Menu>
                            {/* <button
                                type="button"
                                onClick={() => {
                                    data.temp.splice(data.temp.length - 1, 1);
                                    setData({ ...data });
                                }}>
                                <TiArrowBackOutline size={20} color={Colors.buslab} />
                            </button>*/}
                            {data.temp.length > 2 && (
                                <button
                                    onClick={() => {
                                        setActionFence(true);
                                    }}
                                    type="button">
                                    adicionar cerca
                                </button>
                            )}
                        </Menu>
                    )}
                </div>
            )}
        </div>
    );
}

export default CompanyMap;
