import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import DependencyModalCreate from "../../Modals/DependencyModalCreate";
import ModalDelete from "../../../../components/Modais/ModalDelete";
import Title from "../../../../components/Title";
import Card from "../../../../components/Cards/Card";
import ButtonIconTextDefault from "../../../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle } from "react-icons/io";

import { Link } from "react-router-dom";
import eyeSVG from "../../../../assets/svgs/eye.svg";
import trashSVG from "../../../../assets/svgs/trash.svg";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../../assets/constants/Colors";
import Paginate from "../../../../components/Paginate";
import Interceptor from "../../../../services/interceptor";
import SearchEngine from "../../../../components/Filter/SearchEngine";
import Sorting from "../../../../components/Sorting";

const BrandVehicle = props => {
    const [load, setLoad] = useState(false);
    const [modalForm, setModalForm] = useState(0);
    const [modalDecision, setModalBody] = useState(0);
    const [identifierSelected, setIdentifierSelected] = useState();
    const [brandList, setBrandList] = useState([]);
    const [search, setSearch] = useState({ description: "" });
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    const actionModalForm = () => {
        setModalForm(!modalForm);
    };

    useEffect(() => {
        getBrand();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    const getBrand = () => {
        setLoad(true);
        api.get(
            `api/adm/vehicle/brand/list?&${sortingString}&page=${meta.current_page}&description=${
                search.manufacturer || ""
            }`,
            HeaderToken()
        )
            .then(response => {
                setLoad(false);
                setBrandList(response.data.data);
                setMeta(response.data.meta);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const Modals = () => {
        return (
            <>
                <DependencyModalCreate
                    modalPost={modalForm}
                    actionModalPost={actionModalForm}
                    getList={getBrand}
                    type="brand"
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    getList={getBrand}
                    identifier={identifierSelected}
                    type="create"
                    url="vehicle/brand"
                    redirect=""
                    name="fabricante do veículo"
                />
            </>
        );
    };
    return (
        <>
            <Title title={"Fabricantes cadastrados"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    manufacturer: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Listagem de fabricantes de chassi</h2>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            title={"Adicionar"}
                            onClick={actionModalForm}
                            icon={<IoIosAddCircle />}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Fabricante"
                                        field="e.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 font-medium text-14 text-right">Ações</th>
                            </tr>
                        </thead>
                        {brandList.length > 0 && !load && (
                            <tbody>
                                {brandList.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={value.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-right">
                                                <Link
                                                    to={`/vehicle/brand/show/${value.identifier}`}>
                                                    <img
                                                        className="cursor-pointer font-light w-6 text-primary inline mr-4"
                                                        alt="Ver"
                                                        src={eyeSVG}
                                                    />
                                                </Link>
                                                <img
                                                    className="cursor-pointer font-light w-4 text-primary inline"
                                                    alt="Remover"
                                                    src={trashSVG}
                                                    onClick={() => {
                                                        actionModalBody(value.identifier);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                    </table>
                </div>
                <div className="w-full">
                    <div className="flex justify-center">
                        {brandList.length === 0 && !load && (
                            <p className="center">Nenhum fabricante encontrado</p>
                        )}
                        {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                    </div>
                </div>
                {meta.total_pages > 1 && (
                    <Paginate meta={meta} setMeta={setMeta} action={action} setAction={setAction} />
                )}
            </Card>
        </>
    );
};
export default BrandVehicle;
