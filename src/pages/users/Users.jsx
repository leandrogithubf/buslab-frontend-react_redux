import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle } from "react-icons/io";
import trashSVG from "../../assets/svgs/trash.svg";
import eyeSVG from "../../assets/svgs/eye.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import Colors from "../../assets/constants/Colors";
import api from "../../services/api";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import HeaderToken from "../../services/headerToken";
import Paginate from "../../components/Paginate";
import Interceptor from "../../services/interceptor";
import Sorting from "../../components/Sorting";

const Users = props => {
    let [userList, setUserList] = useState([]);
    let [load, setLoad] = useState(false);
    let [title, setTitle] = useState(false);
    let [modalDelete, setModalDelete] = useState(false);
    let [identifierSelected, setIdentifierSelected] = useState();
    let [modalPost, setModalPost] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);

    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        setOptiontitle();
        getUserList();
        getCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.type, action, sortingString]);

    const getUserList = () => {
        setLoad(true);
        api.get(
            `api/adm/user/${props.match.params.type}/list?page=${meta.current_page}&${sortingString}`,
            HeaderToken()
        )
            .then(response => {
                setUserList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompanies = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setCompanies(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const setOptiontitle = () => {
        switch (props.match.params.type) {
            case "system":
                setTitle("Administradores de Sistema");
                break;
            case "company":
                setTitle("Administradores de Empresa");
                break;
            case "manager":
                setTitle("Gerentes de empresa");
                break;
            case "operator":
                setTitle("Operadores de sistemas");
                break;
            default:
                setTitle("Usuários");
        }
    };

    const actionModalDelete = identifier => {
        setIdentifierSelected(identifier);
        setModalDelete(!modalDelete);
    };

    const actionModalPost = () => {
        setModalPost(!modalPost);
    };

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalPost}
                    modalPost={modalPost}
                    getList={() => getUserList()}
                    type={props.match.params.type}
                    companyList={companies}
                />
                <ModalDelete
                    actionModalDelete={actionModalDelete}
                    modalDelete={modalDelete}
                    setModalDelete={setModalDelete}
                    identifier={identifierSelected}
                    getList={() => getUserList()}
                    type={"create"}
                    url="user"
                    redirect={`users/${props.match.params.type}`}
                    name="usuário"
                />
            </>
        );
    };

    return (
        <>
            <Title title={title} crumbs={props.crumbs} />
            <Modals />
            <Card>
                <div className="flex justify-between mb-4">
                    <h4>Listagem de usuários</h4>
                    <ButtonIconTextDefault
                        title={"Adicionar"}
                        onClick={actionModalPost}
                        icon={<IoIosAddCircle />}
                    />
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Nome"
                                        field="e.name"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Email"
                                        field="e.email"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                {props.match.params.type !== "system" && (
                                    <>
                                        <th className="px-3 py-2 text-center font-medium text-14">
                                            <Sorting
                                                label="Empresa"
                                                field="company.description"
                                                currentSortingField={currentSortingField}
                                                setCurrentSortingField={setCurrentSortingField}
                                                currentSortingDirection={currentSortingDirection}
                                                setCurrentSortingDirection={
                                                    setCurrentSortingDirection
                                                }
                                                setSortingString={setSortingString}
                                            />
                                        </th>
                                    </>
                                )}
                                <th className="px-3 py-2 text-center font-medium text-14 w-1/12">Ações</th>
                            </tr>
                        </thead>
                        {userList.length > 0 && !load && (
                            <tbody>
                                {userList.map((user, index) => {
                                    return (
                                        <tr
                                            key={user.identifier}
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {user.email}
                                            </td>
                                            {props.match.params.type !== "system" && (
                                                <>
                                                    <td className="px-4 py-5 font-light text-c8 text-14">
                                                        {user.company && user.company.description}
                                                    </td>
                                                </>
                                            )}

                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link
                                                    to={`/users/${props.match.params.type}/${user.identifier}`}>
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
                                                        actionModalDelete(user.identifier);
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
                        {userList.length === 0 && !load && (
                            <p className="center">Nenhum usuário encontrado </p>
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

export default Users;
