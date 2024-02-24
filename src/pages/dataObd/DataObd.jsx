import React, { useState, useEffect, useRef } from "react";

import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import SearchEngine from "../../components/Filter/SearchEngine";
import { notifyPosition, activeSocket } from "../../services/socket";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import moment from "moment";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

const DataObd = ({ company }) => {
    const [search, setSearch] = useState({
        company: "",
        serialPrefix: "",
        obd: "",
    });
    const [obdData, setObdData] = useState({});

    const companyList = useRef();
    const _socketData = useRef({});

    useEffect(() => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            const companies = {};
            companyList.current = companies;

            response.data.data.forEach(comp => {
                companies[comp.identifier] = { ...comp };
            });
        });
    }, []);

    useEffect(() => {
        const socket = activeSocket();

        let socketData = _socketData.current;

        notifyPosition(socket, null, (err, data) => {
            if (err) {
                return;
            }

            const response = JSON.parse(data);
            if (search.obd === "" && search.serialPrefix === "" && search.company === "") {
                setObdData(socketData);
            } else if (search.obd) {
                socketData = socketData[search.obd] || {};
                if (search.obd === response.obdIdentifier) {
                    socketData = {[response.identifier]: response };
                    setObdData(socketData);
                }
                
            } else if (search.serialPrefix) {
                socketData = socketData[search.serialPrefix] || {};
                if (search.serialPrefix === response.obdIdentifier) {
                    socketData = {[response.identifier]: response };
                    setObdData(socketData);
                }
                
            } else if (search.company) {
                // socketData = socketData[search.company] || {};
                if (search.company === response.company) {
                    socketData = { ...socketData, [response.identifier]: response };
                    setObdData(socketData);
                }
                
            }else {
                socketData = { ...socketData, [response.identifier]: response };
                setObdData(socketData);
            }
        });
        return () => {
            socket.disconnect();
        };
    }, [search]);

    const options = [
        { "id": 1, label: 'GPS', value: 1},
        { "id": 2, label: 'OBD2', value: 2},
        { "id": 3, label: 'Controlador eletrônico de motor 1', value: 3},
        { "id": 4, label: 'Tacógrafo', value: 4},
        { "id": 5, label: 'Distância do veículo de alta resolução', value: 5},
        { "id": 6, label: 'Distância do Veículo', value: 6},
        { "id": 7, label: 'Temperatura do motor 1', value: 7},
        { "id": 8, label: 'Horas do motor, rotações', value: 8},
        { "id": 9, label: 'Direção/Velocidade do veículo', value: 9},
        { "id": 10, label: 'Consumo de combustível (Líquido)', value: 10},
        { "id": 11, label: 'Controlador eletrônico de motor 2', value: 11},
        { "id": 12, label: 'Nível de fluido do motor/Pressão 1', value: 12},
        { "id": 13, label: 'Controle de cruzeiro/velocidade do veículo', value: 13},
        { "id": 14, label: 'Condições de entrada/exaustão', value: 14},
        { "id": 15, label: 'Energia elétrica do veículo', value: 15},
        { "id": 16, label: '(R) Visor de painel', value: 16},
        { "id": 17, label: '(DM1) Códigos de diagnóstico de problemas ativos', value: 17},
        { "id": 18, label: '(DM2) Códigos de diagnóstico de problemas anteriormente ativos', value: 18},
      ];

    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        setSelectedOptions([{ label: "Todos", value: "*" }, ...options]);
    }, []);
    
    function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
        if (value && value.some((o) => o.value === "*")) {
        return `${placeholderButtonLabel}: Todos`;
        } else {
        return `${placeholderButtonLabel}: ${value.length} selected`;
        }
    }
    
    function onChange(value, event) {
        if (event.action === "select-option" && event.option.value === "*") {
        setSelectedOptions(this.options);
        } else if (
        event.action === "deselect-option" &&
        event.option.value === "*"
        ) {
        setSelectedOptions([]);
        } else if (event.action === "deselect-option") {
        setSelectedOptions(value.filter((o) => o.value !== "*"));
        } else if (value.length === this.options.length - 1) {
        setSelectedOptions(this.options);
        } else {
        setSelectedOptions(value);
        setSelectedOptions(value);
        }
    }

    return (
        <>
            <Title title={"Monitoramento de dados de Obds"} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    company: true,
                    serialPrefix: true,
                    obd: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Monitoramento de dados</h2>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    Dados em tempo real
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(obdData).map(value => {
                                const { fullData } = value || {};
                                const can = fullData?.can ? fullData?.can : [];
                                return (
                                <div>
                                    <div className="text-primary ml-4">
                                    <ReactMultiSelectCheckboxes
                                    options={[{ label: "Todos", value: "*" }, ...options]}
                                    placeholderButtonLabel="Parametros"
                                    getDropdownButtonLabel={getDropdownButtonLabel}
                                    value={selectedOptions}
                                    onChange={onChange}
                                    setState={setSelectedOptions}
                                    />
                                    </div>
                                    <tr
                                        key={value.identifier}
                                        className="px-3 py-2 text-left font-medium text-14">
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            <tr>
                                            <h4>OBD: <b>{fullData.serial}</b></h4>
                                            </tr>
                                            <tr>
                                                ======
                                            </tr>
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 1) &&
                                                <>
                                                    <tr>
                                                    <h4>GPS</h4>
                                                    </tr>
                                                    <tr>
                                                    Data: <b>{moment(fullData.date).format("DD/MM/YYYY - HH:mm:ss")}</b>
                                                    </tr>
                                                    <tr>
                                                    Latitude: <b>{fullData.gps?.latitude ? fullData.gps.latitude : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Longitude: <b>{fullData.gps?.longitude ? fullData.gps.longitude : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade(gps): <b>{fullData.gps?.speed?.value ? fullData.gps.speed.value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Angulo(gps): <b>{fullData.gps?.angle?.value ? fullData.gps.angle.value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Hdop(gps): <b>{fullData.gps?.hdop?.value ? fullData.gps.hdop.value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 2) &&
                                                <>
                                                    <tr>
                                                    <h4>OBD2</h4>
                                                    </tr>
                                                    <tr>
                                                    Status recebidos: <b>{fullData.obd_status ? fullData.obd_status : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Distância: <b>{fullData.distance?.value ? fullData.distance.value : '-'} (metros)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do liquido de arrefecimento do motor : <b>{fullData.ect?.value ? fullData.ect.value : '-'} (ºC)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão no coletor de admissão : <b>{fullData.map?.value ? fullData.map.value : '-'} (Kpa)</b>
                                                    </tr>
                                                    <tr>
                                                    RPM : <b>{fullData.rpm ? fullData.rpm : '-'} </b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do ar da admissão : <b>{fullData.iat?.value ? fullData.iat.value : '-'} (ºC)</b>
                                                    </tr>
                                                    <tr>
                                                    Combustível : <b>{fullData.fuel_consumption ? fullData.fuel_consumption : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Erros no Obd : <b>{fullData.obd_errors ? fullData.obd_errors : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 3) &&
                                                <>
                                            <tr>
                                            <h4>Controlador eletrônico de motor 1</h4>
                                            </tr>
                                            <tr>
                                            Modo de torque do motor : <b>{can[61444]?.['Engine Torque Mode']?.value ? can[61444]['Engine Torque Mode'].value : '-'}</b>
                                            </tr>
                                            <tr>
                                            Motor real - Porcentagem de torque de alta resolução(%) : <b>{can[61444]?.['(R) Actual Engine - Percent Torque High Resolution']?.value ? can[61444]['(R) Actual Engine - Percent Torque High Resolution'].value : '-'}</b>
                                            </tr>
                                            <tr>
                                            Motor de demanda do motorista : <b>{can[61444]?.['Drivers Demand Engine']?.value ? can[61444]['Drivers Demand Engine'].value : '-'} (%)</b>
                                            </tr>
                                             <tr>
                                            Motor real : <b>{can[61444]?.['Actual Engine']?.value ? can[61444]['Actual Engine'].value : '-'} (%)</b>
                                            </tr>
                                            <tr>
                                            Velocidade do motor : <b>{can[61444]?.['Engine Speed']?.value ? can[61444]['Engine Speed'].value : '-'} (RPM)</b>
                                            </tr>
                                            <tr>
                                            Endereço de origem do dispositivo de controle para controle do motor : <b>{can[61444]?.['Source Address of Controlling Device for Engine Control']?.value ? can[61444]['Source Address of Controlling Device for Engine Control'].value : '-'}</b>
                                            </tr>
                                            <tr>
                                            Modo de partida do motor : <b>{can[61444]?.['Engine Starter Mode']?.value ? can[61444]['Engine Starter Mode'].value : '-'}</b>
                                            </tr>
                                            <tr>
                                            Motor Real - Porcentagem de Torque(%) : <b>{can[61444]?.['Engine Demand – Percent Torque']?.value ? can[61444]['Engine Demand – Percent Torque'].value : '-'}</b>
                                            </tr>
                                            <tr>
                                                ======
                                            </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 4) &&
                                                <>
                                                    <tr>
                                                    <h4>Tacógrafo</h4>
                                                    </tr>
                                                    <tr>
                                                    Estado de trabalho do motorista 1 : <b>{can[65132]?.['Driver 1 working state']?.value ? can[65132]['Driver 1 working state'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Estado de trabalho do motorista 2 : <b>{can[65132]?.['Driver 2 working state']?.value ? can[65132]['Driver 2 working state'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Movimento do veículo : <b>{can[65132]?.['Vehicle motion']?.value ? can[65132]['Vehicle motion'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Estados relacionados ao tempo do motorista 2 : <b>{can[65132]?.['Driver 1 Time Related States']?.value ? can[65132]['Driver 1 Time Related States'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Cartão do motorista, motorista 1 : <b>{can[65132]?.['Driver card, driver 1']?.value ? can[65132]['Driver card, driver 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade excessiva do veículo : <b>{can[65132]?.['Vehicle Overspeed']?.value ? can[65132]['Vehicle Overspeed'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Estados relacionados ao tempo do motorista 2 : <b>{can[65132]?.['Driver 2 Time Related States']?.value ? can[65132]['Driver 2 Time Related States'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Cartão do motorista, motorista 2 : <b>{can[65132]?.['Driver card, driver 2']?.value ? can[65132]['Driver card, driver 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Evento do sistema : <b>{can[65132]?.['System event']?.value ? can[65132]['System event'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Manipulando informação : <b>{can[65132]?.['Handling information']?.value ? can[65132]['Handling information'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Desempenho do tacógrafo : <b>{can[65132]?.['Tachograph performance']?.value ? can[65132]['Tachograph performance'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Indicador de direção : <b>{can[65132]?.['Direction indicator']?.value ? can[65132]['Direction indicator'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade do eixo de saída do tacógrafo : <b>{can[65132]?.['Tachograph output shaft speed']?.value ? can[65132]['Tachograph output shaft speed'].value : '-'} (RPM)</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade do veículo : <b>{can[65132]?.['Tachograph vehicle speed']?.value ? can[65132]['Tachograph vehicle speed'].value.toFixed(1) : '-'} (Km/h)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 5) &&
                                                <>
                                                    <tr>
                                                    <h4>Distância do veículo de alta resolução</h4> 
                                                    </tr>
                                                    <tr>
                                                    Distância total do veículo de alta resolução : <b>{can[65217]?.['High Resolution Total Vehicle Distance']?.value ? can[65217]['High Resolution Total Vehicle Distance'].value.toFixed(1) : '-'} (Km)</b>
                                                    </tr>
                                                    <tr>
                                                    Distância de viagem de alta resolução : <b>{can[65217]?.['High Resolution Trip Distance']?.value ? can[65217]['High Resolution Trip Distance'].value.toFixed(1) : '-'} (Km)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 6) &&
                                                <>
                                                    <tr>
                                                    <h4>Distância do Veículo</h4> 
                                                    </tr>
                                                    <tr>
                                                    Distância da viagem : <b>{can[65248]?.['Trip Distance']?.value ? can[65248]['Trip Distance'].value : '-'} (Km)</b>
                                                    </tr>
                                                    <tr>
                                                    Distância Total do Veículo : <b>{can[65248]?.['Total Vehicle Distance']?.value ? can[65248]['Total Vehicle Distance'].value : '-'} (Km)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 7) &&
                                                <>
                                                    <tr>
                                                    <h4>Temperatura do motor 1</h4> 
                                                    </tr>
                                                    <tr>
                                                    Temperatura do líquido de arrefecimento do motor : <b>{can[65262]?.['Engine Coolant Temperature']?.value ? can[65262]['Engine Coolant Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do combustível do motor 1 : <b>{can[65262]?.['Engine Fuel Temperature 1']?.value ? can[65262]['Engine Fuel Temperature 1'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do óleo do motor 1 : <b>{can[65262]?.['Engine Oil Temperature 1']?.value ? can[65262]['Engine Oil Temperature 1'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do óleo do turbocompressor do motor : <b>{can[65262]?.['Engine Turbocharger Oil Temperature']?.value ? can[65262]['Engine Turbocharger Oil Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do intercooler do motor : <b>{can[65262]?.['Engine Intercooler Temperature']?.value ? can[65262]['Engine Intercooler Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Abertura do termostato do intercooler do motor : <b>{can[65262]?.['Engine Intercooler Thermostat Opening']?.value ? can[65262]['Engine Intercooler Thermostat Opening'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 8) &&
                                                <>
                                                    <tr>
                                                    <h4>Horas do motor, rotações</h4> 
                                                    </tr>
                                                    <tr>
                                                    Horas totais de operação do motor : <b>{can[65253]?.['Engine Total Hours of Operation']?.value ? can[65253]['Engine Total Hours of Operation'].value : '-'} (H)</b>
                                                    </tr>
                                                    <tr>
                                                    Rotações totais do motor : <b>{can[65253]?.['Engine Total Revolutions']?.value ? can[65253]['Engine Total Revolutions'].value : '-'} (Rotações)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 9) &&
                                                <>
                                                    <tr>
                                                    <h4>Direção/Velocidade do veículo</h4> 
                                                    </tr>
                                                    <tr>
                                                    Direção da bússola : <b>{can[65256]?.['Compass Bearing']?.value ? can[65256]['Compass Bearing'].value : '-'} (Graus)</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade do veículo baseada na navegação : <b>{can[65256]?.['Navigation-Based Vehicle Speed']?.value ? can[65256]['Navigation-Based Vehicle Speed'].value : '-'} (Km/h)</b>
                                                    </tr>
                                                    <tr>
                                                    Distância : <b>{can[65256]?.['Pitch']?.value ? can[65256]['Pitch'].value : '-'} (Graus)</b>
                                                    </tr>
                                                    <tr>
                                                    Altitude : <b>{can[65256]?.['Altitude']?.value ? can[65256]['Altitude'].value : '-'} (m)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 10) &&
                                                <>
                                                    <tr>
                                                    <h4>Consumo de combustível (Líquido)</h4> 
                                                    </tr>
                                                    <tr>
                                                    Combustível de viagem de motor : <b>{can[65257]?.['Engine Trip Fuel']?.value ? can[65257]['Engine Trip Fuel'].value : '-'} (L)</b>
                                                    </tr>
                                                    <tr>
                                                    Combustível total usado no motor : <b>{can[65257]?.['Engine Total Fuel Used']?.value ? can[65257]['Engine Total Fuel Used'].value : '-'} (L)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 11) &&
                                                <>
                                                    <tr>
                                                    <h4>Controlador eletrônico de motor 2</h4> 
                                                    </tr>
                                                    <tr>
                                                    Pedal do acelerador 1, interruptor de baixa rotação : <b>{can[61443]?.['Accelerator Pedal 1 Low Idle Switch']?.value ? can[61443]['Accelerator Pedal 1 Low Idle Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de Kickdown do pedal do acelerador : <b>{can[61443]?.['Accelerator Pedal Kickdown Switch']?.value ? can[61443]['Accelerator Pedal Kickdown Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Status de limite de velocidade da estrada : <b>{can[61443]?.['Road Speed Limit Status']?.value ? can[61443]['Road Speed Limit Status'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Pedal do acelerador 2, interruptor de baixa rotação: <b>{can[61443]?.['Accelerator Pedal 2 Low Idle Switch']?.value ? can[61443]['Accelerator Pedal 2 Low Idle Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Posição do pedal do acelerador 1 : <b>{can[61443]?.['Accelerator Pedal Position 1']?.value ? can[61443]['Accelerator Pedal Position 1'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Porcentagem de carga do motor na velocidade atual : <b>{can[61443]?.['Engine Percent Load At Current Speed']?.value ? can[61443]['Engine Percent Load At Current Speed'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Posição do pedal do acelerador remoto : <b>{can[61443]?.['Remote Accelerator Pedal Position']?.value ? can[61443]['Remote Accelerator Pedal Position'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Posição do pedal do acelerador 2: <b>{can[61443]?.['Accelerator Pedal Position 2']?.value ? can[61443]['Accelerator Pedal Position 2'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Status do limite da taxa de aceleração do veículo : <b>{can[61443]?.['Vehicle Acceleration Rate Limit Status']?.value ? can[61443]['Vehicle Acceleration Rate Limit Status'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Motor Máximo Disponível Real - Porcentagem de Torque : <b>{can[61443]?.['Actual Maximum Available Engine - Percent Torque']?.value ? can[61443]['Actual Maximum Available Engine - Percent Torque'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 12) &&
                                                <>
                                                    <tr>
                                                    <h4>Nível de fluido do motor/Pressão 1</h4> 
                                                    </tr>
                                                    <tr>
                                                    Pressão de entrega de combustível do motor : <b>{can[65263]?.['Engine Fuel Delivery Pressure']?.value ? can[65263]['Engine Fuel Delivery Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão de sopragem do cárter estendido do motor : <b>{can[65263]?.['Engine Extended Crankcase Blow-by Pressure']?.value ? can[65263]['Engine Extended Crankcase Blow-by Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Nível de óleo do motor : <b>{can[65263]?.['Engine Oil Level']?.value ? can[65263]['Engine Oil Level'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão do óleo do motor : <b>{can[65263]?.['Engine Oil Pressure']?.value ? can[65263]['Engine Oil Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão do cárter do motor : <b>{can[65263]?.['ngine Crankcase Pressure']?.value ? can[65263]['ngine Crankcase Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão do líquido refrigerante do motor : <b>{can[65263]?.['Engine Coolant Pressure']?.value ? can[65263]['Engine Coolant Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Nível do líquido refrigerante do motor : <b>{can[65263]?.['Engine Coolant Level']?.value ? can[65263]['Engine Coolant Level'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 13) &&
                                                <>
                                                    <tr>
                                                    <h4>Controle de cruzeiro/velocidade do veículo</h4> 
                                                    </tr>
                                                    <tr>
                                                    Chave de eixo de duas velocidades : <b>{can[65265]?.['Two Speed Axle Switch']?.value ? can[65265]['Two Speed Axle Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor do freio de estacionamento : <b>{can[65265]?.['Parking Brake Switch']?.value ? can[65265]['Parking Brake Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de pausa do controle de cruzeiro : <b>{can[65265]?.['Cruise Control Pause Switch']?.value ? can[65265]['Cruise Control Pause Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Solicitação de inibição da liberação do freio de estacionamento : <b>{can[65265]?.['Park Brake Release Inhibit Request']?.value ? can[65265]['Park Brake Release Inhibit Request'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade do veículo com base nas rodas : <b>{can[65265]?.['Wheel-Based Vehicle Speed']?.value ? can[65265]['Wheel-Based Vehicle Speed'].value : '-'} (Km/h)</b>
                                                    </tr>
                                                    <tr>
                                                    Controle de cruzeiro ativo : <b>{can[65265]?.['Cruise Control Active']?.value ? can[65265]['Cruise Control Active'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de habilitação do controle de cruzeiro : <b>{can[65265]?.['Cruise Control Enable Switch']?.value ? can[65265]['Cruise Control Enable Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de freio : <b>{can[65265]?.['Brake Switch']?.value ? can[65265]['Brake Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Chave de embreagem : <b>{can[65265]?.['Clutch Switch']?.value ? can[65265]['Clutch Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de ajuste do controle de cruzeiro : <b>{can[65265]?.['Cruise Control Set Switch']?.value ? can[65265]['Cruise Control Set Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de controle de velocidade de cruzeiro (desacelerar) : <b>{can[65265]?.['Cruise Control Coast (Decelerate) Switch']?.value ? can[65265]['Cruise Control Coast (Decelerate) Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Botão de retomada do controle de cruzeiro : <b>{can[65265]?.['Cruise Control Resume Switch']?.value ? can[65265]['Cruise Control Resume Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de aceleração do Cruise Control : <b>{can[65265]?.['Cruise Control Accelerate Switch']?.value ? can[65265]['Cruise Control Accelerate Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Velocidade definida do controle de cruzeiro : <b>{can[65265]?.['Cruise Control Set Speed']?.value ? can[65265]['Cruise Control Set Speed'].value : '-'} (Km/h)</b>
                                                    </tr>
                                                    <tr>
                                                    Estado do governador da PTO : <b>{can[65265]?.['(R) PTO Governor State']?.value ? can[65265]['(R) PTO Governor State'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Estados de controle de cruzeiro : <b>{can[65265]?.['Cruise Control States']?.value ? can[65265]['Cruise Control States'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de incremento de marcha lenta do motor : <b>{can[65265]?.['Engine Idle Increment Switch']?.value ? can[65265]['Engine Idle Increment Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de redução de marcha lenta do motor : <b>{can[65265]?.['Engine Idle Decrement Switch']?.value ? can[65265]['Engine Idle Decrement Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de modo de teste do motor : <b>{can[65265]?.['Engine Test Mode Switch']?.value ? can[65265]['Engine Test Mode Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Interruptor de cancelamento de desligamento do motor : <b>{can[65265]?.['Engine Shutdown Override Switch']?.value ? can[65265]['Engine Shutdown Override Switch'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 14) &&
                                                <>
                                                    <tr>
                                                    <h4>Condições de entrada/exaustão</h4> 
                                                    </tr>
                                                    <tr>
                                                    Pressão de entrada do filtro de partículas diesel do motor 1 : <b>{can[65270]?.['(R) Engine Diesel Particulate Filter Inlet Pressure']?.value ? can[65270]['(R) Engine Diesel Particulate Filter Inlet Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão do coletor de admissão do motor : <b>{can[65270]?.['Engine Intake Manifold #1 Pressure']?.value ? can[65270]['Engine Intake Manifold #1 Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do coletor de admissão do motor 1 : <b>{can[65270]?.['Engine Intake Manifold 1 Temperature']?.value ? can[65270]['Engine Intake Manifold 1 Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão de entrada de ar do motor : <b>{can[65270]?.['Engine Air Inlet Pressure']?.value ? can[65270]['Engine Air Inlet Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão diferencial do filtro de ar do motor 1 : <b>{can[65270]?.['Engine Air Filter 1 Differential Pressure']?.value ? can[65270]['Engine Air Filter 1 Differential Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura do gás de escape do motor : <b>{can[65270]?.['Engine Exhaust Gas Temperature']?.value ? can[65270]['Engine Exhaust Gas Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão diferencial do filtro do líquido refrigerante do motor : <b>{can[65270]?.['Engine Coolant Filter Differential Pressure']?.value ? can[65270]['Engine Coolant Filter Differential Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 15) &&
                                                <>
                                                    <tr>
                                                    <h4>Energia elétrica do veículo</h4> 
                                                    </tr>
                                                    <tr>
                                                    Corrente da bateria : <b>{can[65271]?.['Net Battery Current']?.value ? can[65271]['Net Battery Current'].value : '-'} (A)</b>
                                                    </tr>
                                                    <tr>
                                                    Corrente do alternador : <b>{can[65271]?.['Alternator Current']?.value ? can[65271]['Alternator Current'].value : '-'} (A)</b>
                                                    </tr>
                                                    <tr>
                                                    Potencial do sistema de carga (tensão) : <b>{can[65271]?.['Charging System Potential (Voltage)']?.value ? can[65271]['Charging System Potential (Voltage)'].value : '-'} (V)</b>
                                                    </tr>
                                                    <tr>
                                                    Potencial da bateria/entrada de energia 1 : <b>{can[65271]?.['Battery Potential / Power Input 1']?.value ? can[65271]['Battery Potential / Power Input 1'].value : '-'} (V)</b>
                                                    </tr>
                                                    <tr>
                                                    Potencial da bateria da chave seletora : <b>{can[65271]?.['Keyswitch Battery Potential']?.value ? can[65271]['Keyswitch Battery Potential'].value : '-'} (V)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 16) &&
                                                <>
                                                    <tr>
                                                    <h4>(R) Visor de painel</h4> 
                                                    </tr>
                                                    <tr>
                                                    Nível de fluido do lavador : <b>{can[65276]?.['Washer Fluid Level']?.value ? can[65276]['Washer Fluid Level'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Nível de Combustível 1 : <b>{can[65276]?.['(R) Fuel Level 1']?.value ? can[65276]['(R) Fuel Level 1'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão diferencial do filtro de combustível do motor : <b>{can[65276]?.['Engine Fuel Filter Differential Pressure']?.value ? can[65276]['Engine Fuel Filter Differential Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Pressão diferencial do filtro de óleo do motor : <b>{can[65276]?.['Engine Oil Filter Differential Pressure']?.value ? can[65276]['Engine Oil Filter Differential Pressure'].value : '-'} (kPa)</b>
                                                    </tr>
                                                    <tr>
                                                    Temperatura ambiente da carga : <b>{can[65276]?.['Cargo Ambient Temperature']?.value ? can[65276]['Cargo Ambient Temperature'].value : '-'} (C)</b>
                                                    </tr>
                                                    <tr>
                                                    Nível de Combustível 2 : <b>{can[65276]?.['(R) Fuel Level 2']?.value ? can[65276]['(R) Fuel Level 2'].value : '-'} (%)</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 17) &&
                                                <>
                                                    <tr>
                                                    <h4>(DM1) Códigos de diagnóstico de problemas ativos</h4> 
                                                    </tr>
                                                    <tr>
                                                    Status da lâmpada indicadora de mau funcionamento 1 : <b>{can[65226]?.['Malfunction Indicator Lamp Status 1']?.value ? can[65226]['Malfunction Indicator Lamp Status 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Status 1 da lâmpada de parada vermelha : <b>{can[65226]?.['Red Stop Lamp Status 1']?.value ? can[65226]['Red Stop Lamp Status 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Status 1 da lâmpada de advertência âmbar : <b>{can[65226]?.['Amber Warning Lamp Status 1']?.value ? can[65226]['Amber Warning Lamp Status 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Proteger o status da lâmpada 1 : <b>{can[65226]?.['Protect Lamp Status 1']?.value ? can[65226]['Protect Lamp Status 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    SPN 1: <b>{can[65226]?.['SPN 1']?.value ? can[65226]['SPN 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Identificador de modo de falha (FMI) 1 : <b>{can[65226]?.['Failure Mode Identifier (FMI) 1']?.value ? can[65226]['Failure Mode Identifier (FMI) 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Contagem de ocorrências 1 : <b>{can[65226]?.['Occurrence Count 1']?.value ? can[65226]['Occurrence Count 1'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                        ======
                                                    </tr>
                                                </>
                                            }
                                            {
                                                selectedOptions?.find((selected)=>selected.value === 18) &&
                                                <>
                                                    <tr>
                                                    <h4>(DM2) Códigos de diagnóstico de problemas anteriormente ativos</h4> 
                                                    </tr>
                                                    <tr>
                                                    Status da lâmpada indicadora de mau funcionamento 2 : <b>{can[65226]?.['Malfunction Indicator Lamp Status 2']?.value ? can[65226]['Malfunction Indicator Lamp Status 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Status 2 da lâmpada de parada vermelha : <b>{can[65226]?.['Red Stop Lamp Status 2']?.value ? can[65226]['Red Stop Lamp Status 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Status 2 da lâmpada de advertência âmbar : <b>{can[65226]?.['Amber Warning Lamp Status 2']?.value ? can[65226]['Amber Warning Lamp Status 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Proteger o status da lâmpada 2 : <b>{can[65226]?.['Protect Lamp Status 2']?.value ? can[65226]['Protect Lamp Status 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    SPN 2: <b>{can[65226]?.['SPN 2']?.value ? can[65226]['SPN 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Identificador de modo de falha (FMI) 2 : <b>{can[65226]?.['Failure Mode Identifier (FMI) 2']?.value ? can[65226]['Failure Mode Identifier (FMI) 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    Contagem de ocorrências 2 : <b>{can[65226]?.['Occurrence Count 2']?.value ? can[65226]['Occurrence Count 2'].value : '-'}</b>
                                                    </tr>
                                                    <tr>
                                                    ======
                                                    </tr>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                </div>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full">
                    <div className="flex justify-center"></div>
                </div>
            </Card>
        </>
    );
};

export default DataObd;