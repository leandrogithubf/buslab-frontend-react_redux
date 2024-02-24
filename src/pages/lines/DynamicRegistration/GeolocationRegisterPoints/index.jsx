import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";
import { useHistory } from "react-router-dom";

import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import target from "../../../../assets/svgs/target.svg";
import trash from "../../../../assets/svgs/trash.svg";
import Title from "../../../../components/Title";
import Card from "../../../../components/Cards/Card";
import Back from "../../../../components/Back";
import ButtonIconTextDefault from "../../../../components/Buttons/default/ButtonIconTextDefault";
import ButtonRed from "../../../../components/Buttons/red/ButtonRed";
import ButtonDefault from "../../../../components/Buttons/default/ButtonDefault";
import GoogleMaps from "../../../../components/Maps/GoogleMaps";

const GeolocationRegisterPoints = props => {
    let history = new useHistory();
    const [viewport, setViewport] = useState({
        latitude: -23.533773,
        longitude: -46.62529,
        zoom: 10,
    });
    const [locationSelected, setLocationsSelected] = useState([]);
    const [load, setLoad] = useState([]);

    const getPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            let latitude = position.coords.latitude.toString().slice(0, 10);
            let longitude = position.coords.longitude.toString().slice(0, 10);
            if (latitude && longitude) {
                setLocationsSelected([...locationSelected, { latitude, longitude }]);
            }
            actionCentroid({ latitude, longitude });
        });
    };

    const handleRemoveLocation = index => {
        locationSelected.splice(index, 1);
        setLocationsSelected([...locationSelected]);
    };

    const sendPoints = () => {
        let arrLocation = locationSelected.map((location, index) => ({
            latitude: location.latitude,
            longitude: location.longitude,
            sequence: index + 1,
        }));

        api.post(
            `/api/adm/line/${props.match.params.idLine}/points`,
            { points: arrLocation },
            HeaderToken()
        )
            .then(() => {
                toast.info("Pontos adicionados com sucesso!");
                history.goBack();
                setLoad(false);
            })
            .catch(() => {
                toast.info("Algo deu errado, verifique seus endereços!");
            });
    };

    const actionCentroid = location => {
        setViewport({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 10,
        });
    };

    return (
        <>
            <Title title={"Gerador de itinerário por geolocalização"} crumbs={props.crumbs} />
            <Card>
                <form>
                    <div className="flex justify-between mb-2">
                        <Back />
                    </div>

                    <div className="flex xs:flex-col-reverse md:flex-row flex-wrap mb-4">
                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 md:pr-4">
                            <div className="flex justify-between mb-2 items-end">
                                <h2 className="mb-2 font-light w-2/3">Adicionar marcação</h2>
                            </div>
                            {locationSelected.map((location, index) => {
                                return (
                                    <div
                                        key={location.longitude + index}
                                        className={`sm:w-full xs:w-full flex items-center py-4 px-2 ${
                                            index % 2 === 0 ? "bg-tablerow" : ""
                                        }`}>
                                        <div className="w-1/6">
                                            <p className="font-medium text-14 text-custom_c7">{`${
                                                index + 1
                                            }º`}</p>
                                        </div>
                                        <div className="w-2/6">
                                            <p className="text-light text-14 text-custom_gray_medium">
                                                {location.latitude}
                                            </p>
                                        </div>
                                        <div className="w-2/6">
                                            <p className="text-light text-14 text-custom_gray_medium">
                                                {location.longitude}
                                            </p>
                                        </div>
                                        <div className="flex justify-between w-1/6">
                                            <img
                                                onClick={() => actionCentroid(location)}
                                                src={target}
                                                alt="localização"
                                                className="cursor-pointer"
                                            />
                                            <img
                                                src={trash}
                                                className="cursor-pointer"
                                                alt="excluir"
                                                onClick={() => handleRemoveLocation(index)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="mt-4">
                                <ButtonDefault
                                    onClick={getPosition}
                                    title="Adicionar localização atual"
                                />
                            </div>
                        </div>
                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-2/3 md:pl-4 mb-4">
                            <section style={{ height: "600px" }}>
                                <GoogleMaps
                                    viewport={viewport}
                                    points={locationSelected}
                                    setPoints={setLocationsSelected}
                                    type="draw"
                                />
                            </section>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <ButtonRed
                            type="button"
                            title="Cancelar"
                            onClick={() => {
                                history.goBack();
                            }}
                        />
                        <ButtonIconTextDefault
                            type="button"
                            onClick={sendPoints}
                            title="Salvar"
                            className="ml-4"
                            icon={<IoIosSave size={20} />}
                        />
                    </div>
                </form>
            </Card>
        </>
    );
};
export default GeolocationRegisterPoints;
