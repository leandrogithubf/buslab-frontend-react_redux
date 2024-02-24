import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { CSVLink } from 'react-csv';
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import eyeSVG from "../../assets/svgs/eye.svg";
import SearchEngine from "../../components/Filter/SearchEngine";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosCloudDownload } from "react-icons/io";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import Colors from "../../assets/constants/Colors";
import Paginate from "../../components/Paginate";
import ClipLoader from "react-spinners/ClipLoader";
import Interceptor from "../../services/interceptor";
import { dateDiffTrip, RedLines } from "../../components/Table/RedLines";
import Sorting from "../../components/Sorting";
import useFilterFormat from "../../hooks/useFilterFormat";
import { getPastDays } from "../../components/Filter/utils";

const Trip = props => {
    const [search, setSearch] = useState({
        ...getPastDays(7),
    });
    const [action, setAction] = useState(1);
    const [csvToExport, setCsvToExport] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [load, setLoad] = useState(true);
    const [scheduleDateList, setTripList] = useState([]);
    const newSearch = useFilterFormat(search);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getTrip();
        exportTrip();
    }, [action, newSearch, sortingString]);

    const getTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/list?&page=${meta.current_page}&${sortingString}`, {
            params: newSearch,
            ...HeaderToken(),
        })
        .then(response => {
            setTripList(response.data.data);
            setMeta(response.data.meta);
            setLoad(false);
        })
        .catch(error => {
            setLoad(false);
            Interceptor(error);
        });
    };

    const exportTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/export`, {
            params: newSearch,
            ...HeaderToken(),
        })
        .then(response => {
            setLoad(false);
            setCsvToExport(response.data)
        })
    };

    return (
        <>
            <Title title={"Lista de viagens"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    period: true,
                    vehicle: true,
                    driver: true,
                    line: true,
                    company: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Viagens no período</h2>
                    <div className="text-right">
                        <CSVLink data={csvToExport} filename={"Viagens.csv"} target="_blank">
                            <ButtonIconTextDefault
                                className="mr-2"
                                title={"Exportar"}
                                icon={<IoIosCloudDownload />}
                            />
                        </CSVLink>
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Tabela"
                                        field="schedule.tableCode"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Linha"
                                        field="line.code"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Sentido"
                                        field="line.direction"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Motorista"
                                        field="driver.name"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    Prefixo
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">Data</th>
                                {/*<th className="px-3 py-2 text-left font-medium text-14">Data</th>*/}
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    <Sorting
                                        label="Horário Prog. Partida"
                                        field="schedule.startsAt"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    Horário Real Partida
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    <Sorting
                                        label="Horário Prog. Chegada"
                                        field="schedule.endsAt"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    Horário Real Chegada
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleDateList.length > 0 &&
                                scheduleDateList.map((scheduleDate, index) => {
                                    return (
                                        <RedLines
                                            key={scheduleDate.identifier}
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            red={dateDiffTrip(
                                                scheduleDate.schedule?.endsAt,
                                                scheduleDate.trip?.ends_at,
                                                scheduleDate.schedule?.dataValidity
                                            )}>
                                            <td className="py-5 text-center font-light text-c8 text-14">
                                                {scheduleDate.schedule.tableCode}
                                            </td>

                                            <td className="py-5 text-center font-light text-c8 text-14">
                                                {scheduleDate.schedule.line?.code}
                                            </td>
                                            <td className="px-4 text-center py-5 font-light text-c8 text-14">
                                                {scheduleDate.schedule.line?.direction == "RETURN"
                                                    ? "Volta"
                                                    : scheduleDate.schedule.line?.direction ==
                                                      "GOING"
                                                    ? "Ida"
                                                    : "Circular"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {scheduleDate.driver.name + " (escala do dia)"}
                                            </td>
                                            <td className="py-5 text-center font-light text-c8 text-14">
                                                {scheduleDate.vehicle.prefix}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                    <span>
                                                        {moment(scheduleDate.date).format("DD/MM/YYYY")}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-5 text-center font-light text-c8 text-14">
                                                {moment(scheduleDate.schedule.startsAt).format(
                                                    "HH:mm"
                                                )}
                                            </td>
                                            <td className="px-4 py-5 text-center font-light text-c8 text-14">
                                                {scheduleDate.trip ? (
                                                    <span>
                                                        {moment(scheduleDate.trip.starts_at).format(
                                                            "HH:mm"
                                                        )}
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="px-4 py-5 text-center font-light text-c8 text-14">
                                                {moment(scheduleDate.schedule.endsAt).format(
                                                    " HH:mm"
                                                )}
                                            </td>
                                            <td className="px-4 py-5 text-center font-light text-c8 text-14">
                                                {scheduleDate.trip ? (
                                                    <span>
                                                        {scheduleDate.trip.ends_at ? moment(scheduleDate.trip.ends_at).format("HH:mm") : 'Em viagem'
                                                        }
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center">
                                                {
                                                    scheduleDate.trip &&
                                                    scheduleDate.trip.status.description === "Concluída" &&
                                                    (
                                                        <Link
                                                            to={`/trip/show/${scheduleDate.identifier}`}>
                                                            <img
                                                                className="cursor-pointer font-light w-6 text-primary inline mr-4"
                                                                alt="Ver"
                                                                src={eyeSVG}
                                                            />
                                                        </Link>
                                                    )
                                                }
                                            </td>
                                        </RedLines>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full">
                    <div className="flex justify-center">
                        {scheduleDateList.length === 0 && !load && (
                            <p className="center">Nenhuma viagem encontrada </p>
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

export default Trip;
