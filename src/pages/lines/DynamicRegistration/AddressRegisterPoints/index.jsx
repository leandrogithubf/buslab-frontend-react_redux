import React,  { useState }  from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";

import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import { centroid } from "../../../../services/centroidGeolocalization";
import Title from "../../../../components/Title";
import Card from "../../../../components/Cards/Card";
import Back from "../../../../components/Back";
import { LoadSave } from "../../../../components/Details";
import ButtonIconTextDefault from "../../../../components/Buttons/default/ButtonIconTextDefault";
import ButtonRed from "../../../../components/Buttons/red/ButtonRed";
import { Error } from "../../../../components/Formik";
import ButtonDefault from "../../../../components/Buttons/default/ButtonDefault";
import GoogleMaps from "../../../../components/Maps/GoogleMaps";

const yup = require("yup");
const SchemaAddresRegisterPoints = yup.object().shape({
    address: yup.string().required("Campo obrigatório"),
});
const AddressRegisterPoints = props => {
    let history = new useHistory();
    const [addressList, setAddressList] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: "",
        longitude: "",
        zoom: 10,
    });

    const actionCentroid = locations => {
        const allMarkers = locations.map(location => ({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
        }));

        let currentLocation = centroid(allMarkers);
        setViewport({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            zoom: 10,
        });
    };

    const getLocations = values => {
        return api
            .post(`/api/geolocation/search-batch`, { search: values.address }, HeaderToken())
            .then(res => {
                const addressFound = res.data.map((res, index) => {
                    if (typeof res === "object") {
                        return {
                            ...res,
                            latitude: res.lat,
                            longitude: res.lon,
                            sequence: index + 1,
                        };
                    } else {
                        toast.info(res);
                        return {};
                    }
                });
                setAddressList(addressFound);
                actionCentroid(addressFound);
            });
    };
    return (
        <>
            <Title title={"Gerador de itinerário por endereço"} crumbs={props.crumbs} />
            <Card>
                <Formik
                    initialValues={{
                        address: "",
                    }}
                    validationSchema={SchemaAddresRegisterPoints}
                    onSubmit={(values, { setSubmitting }) => {
                        const arrAddress = addressList.map((address, index) => ({
                            latitude: address.latitude,
                            longitude: address.longitude,
                            sequence: index + 1,
                        }));
                        api.post(
                            `/api/adm/line/${props.match.params.idLine}/points`,
                            { points: arrAddress },
                            HeaderToken()
                        )
                            .then(() => {
                                toast.info("Pontos adicionados com sucesso!");
                                history.goBack();
                                setSubmitting(false);
                            })
                            .catch(() => {
                                toast.info("Algo deu errado, verifique seus endereços!");
                            });
                    }}>
                    {({ handleChange, handleSubmit, isSubmitting, values, setSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between mb-2">
                                <Back />
                                <LoadSave isSubmitting={isSubmitting} />
                            </div>

                            <h2 className="mb-2 font-light">Adicionar pontos</h2>
                            <div className="flex flex-wrap">
                                <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 lg:pr-4">
                                    <div className="flex justify-between mb-2 items-end">
                                        <p className="text-lg font-bold w-2/3">
                                            Insira endereços para encontrar no mapa <br />
                                            <span className="text-sm font-medium">
                                                separados por quebra de linha
                                            </span>
                                        </p>
                                    </div>
                                    <textarea
                                        name="address"
                                        onChange={handleChange}
                                        value={values.address}
                                        className="h-127 appearance-none block w-full rounded text-gray-700 border border-gray-300 py-2 px-4 mb-3 resize-none focus:outline-none focus:bg-white"
                                    />
                                    <Error name="address" />
                                    <div className="flex justify-end">
                                        <ButtonDefault
                                            onClick={() => getLocations(values)}
                                            title="Adicionar lista de endereços"
                                        />
                                    </div>
                                </div>
                                <div className="xs:w-full sm:w-full md:w-1/2 lg:w-2/3 lg:pl-4">
                                    <section style={{ height: "600px" }}>
                                        <GoogleMaps
                                            viewport={viewport}
                                            points={addressList}
                                            setPoints={setAddressList}
                                            type="draw"
                                        />
                                    </section>
                                    <div className="flex justify-end mt-6">
                                        <ButtonRed
                                            type="button"
                                            title="Cancelar"
                                            onClick={() => {
                                                history.goBack();
                                            }}
                                        />
                                        <ButtonIconTextDefault
                                            type="submit"
                                            title="Salvar"
                                            className="ml-4"
                                            icon={<IoIosSave size={20} />}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card>
        </>
    );
};
export default AddressRegisterPoints;
