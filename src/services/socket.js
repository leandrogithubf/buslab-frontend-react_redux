import openSocket from "socket.io-client";
import RuntimeEnv from "../config/RuntimeEnv";

export const activeSocket = () =>
    openSocket(RuntimeEnv.SOCKET_URL, { secure: RuntimeEnv.SOCKET_IS_SECURE });

export const notifyObdCurrent = (serial, socket, cb) => {
    socket.on("notify-obd-" + serial, data => {
        cb(null, data);
    });
};

export const notifyObd = (socket, cb) => {
    socket.on("notify-obd", data => {
        cb(null, data);
    });
};

export const notifyPosition = (socket, company, cb) => {
    socket.on(`notify-position${company ? `-${company}` : ""}`, data => {
        cb(null, data);
    });
};

export const notifyStatus = (socket, cb) => {
    socket.on("notify-status", data => {
        cb(null, data);
    });
};

export const notifyPlacar = (socket, cb) => {
    socket.on("notify-placar", data => {
        cb(null, data);
    });
};

export const notifyPlacarCompany = (company, socket, cb) => {
    socket.on("notify-placar-" + company, data => {
        cb(null, data);
    });
};
