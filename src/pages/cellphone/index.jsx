import React, { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import Title from "../../components/Title";
import Sorting from "../../components/Sorting";
import api from "../../services/api";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import { Link } from "react-router-dom";
import { IoIosAddCircle, IoIosCloudUpload } from "react-icons/io";
import NumberFormat from "react-number-format"; //https://www.npmjs.com/package/react-number-format
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import HeaderToken from "../../services/headerToken";
import Paginate from "../../components/Paginate";
import Interceptor from "../../services/interceptor";
import SearchEngine from "../../components/Filter/SearchEngine";
import ModalImport from "./Modals/ModalImport";

const CellphoneNumber = props => {
    let [load, setLoad] = useState(false);
    let [cellphoneList, setCellphoneList] = useState([]);
    let [modalDelete, setModalDelete] = useState(false);
    let [modalPost, setModalPost] = useState(false);
    let [identifierSelected, setIdentifierSelected] = useState();
    const [modalImport, setModalImport] = useState(false);
    const [search, setSearch] = useState({ cellphone: "" });
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);

    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getCellphone();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    const getCellphone = () => {
        setLoad(true);
        api.get(
            `api/adm/cellphone/list?page=${meta.current_page}&number=${search.cellphone}&${sortingString}`,
            HeaderToken()
        )
            .then(response => {
                setCellphoneList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const actionModalDelete = identifier => {
        setIdentifierSelected(identifier);
        setModalDelete(!modalDelete);
    };

    const actionModalPost = () => {
        setModalPost(!modalPost);
    };

    const actionModalImport = () => {
        setModalImport(!modalImport);
    };

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalPost}
                    modalPost={modalPost}
                    getList={() => getCellphone()}
                />
                <ModalDelete
                    actionModalDelete={actionModalDelete}
                    modalDelete={modalDelete}
                    identifier={identifierSelected}
                    getList={() => getCellphone()}
                    type={"create"}
                    name="celular"
                    url="cellphone"
                    redirect="/cellphone"
                />
                <ModalImport
                    actionModalPost={actionModalImport}
                    modalPost={modalImport}
                    type="cellphones"
                />
            </>
        );
    };

    return (
        <>
            <Title title={"Números de celular"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    cellphone: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h4>Listagem de números</h4>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            className="mr-2"
                            title={"Importar"}
                            onClick={actionModalImport}
                            icon={<IoIosCloudUpload />}
                        />
                        <ButtonIconTextDefault
                            title={"Adicionar"}
                            onClick={actionModalPost}
                            icon={<IoIosAddCircle />}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14 w-11/12">
                                    <Sorting
                                        label="Número"
                                        field="e.number"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>

                                <th className="px-3 py-2 font-medium text-14 w-1/12">Ações</th>
                            </tr>
                        </thead>
                        {cellphoneList.length > 0 && !load && (
                            <tbody>
                                {cellphoneList.map((value, index) => {
                                    return (
                                        <tr
                                            key={value.identifier}
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                <NumberFormat
                                                    value={value.number}
                                                    displayType={"text"}
                                                    format="(##) #####-####"
                                                />
                                            </td>

                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center">
                                                <Link to={`/cellphone/${value.identifier}`}>
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
                                                        actionModalDelete(value.identifier);
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
                        {cellphoneList.length === 0 && !load && (
                            <p className="center">Nenhum celular encontrado </p>
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

export default CellphoneNumber;
