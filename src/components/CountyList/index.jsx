import React from "react";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";
import { Input, Error } from "../Formik";
import { Formik } from "formik";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";

const yup = require("yup");
const schemaCounty = yup.object().shape({
    uf: yup.string().required("Campo obrigatório").max(2, "Máximo de 2 dígitos"),
    county: yup.string().required("O campo é obrigatório"),
});
const CountyList = ({ countiesSelected, setCountiesSelected, setGeolocation, geolocation }) => {
    
    return (
        <>
            <h2 className="mb-4 mt-6 font-light">Municípios</h2>
            {countiesSelected.map((county, index) => (
                <div
                    className={`sm:w-full xs:w-full flex items-center py-4 px-2 ${
                        index % 2 === 0 ? "bg-tablerow" : ""
                    }`}>
                    <div className="flex justify-between w-1/4">
                        <p className="text-light text-14">{county.uf}</p>
                    </div>
                    <div className="flex w-3/4">
                        <p className="text-light text-14">{county.county}</p>
                    </div>
                </div>
            ))}

            <Formik
                initialValues={{
                    uf: "",
                    county: "",
                }}
                validationSchema={schemaCounty}
                onSubmit={(values, { setSubmitting }) => {
                    api.get(`/api/geolocation/search?search=${values.county}, ${values.uf}`, HeaderToken()).then(
                        response => {
                            setCountiesSelected([...countiesSelected, values]);
                            response.data.length > 0 &&
                                response.data.map(data => {
                                    return setGeolocation([...geolocation, { lat: data.lat, lng: data.lon }]);
                                });
                        }
                    );
                }}>
                {({ handleChange, handleSubmit, isSubmitting, values }) => (
                    <form onSubmit={handleSubmit} className="flex mt-2">
                        <div className="w-1/6 pr-3">
                            <Input name="uf" placeholder="UF" />
                            <Error name="uf" />
                        </div>
                        <div className="w-3/6 pr-3 pl-3">
                            <Input name="county" placeholder="Município" />
                            <Error name="county" />
                        </div>
                        <div className="w-2/6">
                            <ButtonDefault title="Adicionar" className="w-full" type="submit" />
                        </div>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default CountyList;
