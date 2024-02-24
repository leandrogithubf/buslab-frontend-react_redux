import React, { useState, useEffect } from "react";
import moment from "moment";

import playerSVG from "../../../assets/svgs/player.svg";
import pauseSVG from "../../../assets/svgs/pause.svg";

const Replay = ({
    action,
    setAction,
    startsAt,
    endsAt,
    vehicles,
    setDateLimit,
    setVehiclesMap,
}) => {
    const [points, setPoints] = useState([]);
    function handleChangeAction() {
        setAction(!action);
    }

    function handleChangeDateLimit(startDate) {
        setDateLimit({
            min: moment(startDate).subtract(1, "minute").format("YYYY-MM-DD HH:mm:ss"),
            max: endsAt,
        });

        if (action) {
            setAction(false);
            setTimeout(() => {
                setAction(true);
            }, 1000);
        } else {
            setAction(true);
            setTimeout(() => {
                setAction(false);
            }, 1500);
        }
    }

    useEffect(() => {
        if (vehicles && Object.values(vehicles).length) {
            const first = moment([Object.values(vehicles)][0][0][0].date).format(
                "YYYY-MM-DD HH:mm"
            );
            const last = moment(
                [Object.values(vehicles)].slice(-1)[0].slice(-1)[0].slice(-1)[0].date
            ).format("YYYY-MM-DD HH:mm");

            const pointsArr = [];
            for (
                let x = first;
                x <= last;
                x = moment(x).add(1, "minutes").format("YYYY-MM-DD HH:mm")
            ) {
                pointsArr.push(x);
            }
            setPoints(pointsArr);
        }
    }, [vehicles]);

    return (
        <div className="bg-c1 w-full p-4">
            <div className="h-1 bg-buslab flex justify-between items-center cursor-pointer ">
                {points.length > 0 &&
                    points.map((datePoint, index) => {
                        const start = moment(startsAt).format("YYYY-MM-DD HH:mm");
                        let match = start === datePoint;

                        return (
                            <div
                                className={index + 1 !== points.length ? "flex-grow" : ""}
                                key={datePoint}>
                                {match ? (
                                    <div
                                        onClick={() => {
                                            handleChangeDateLimit(datePoint);
                                        }}
                                        className="h-4 w-4 rounded-full bg-buslab"
                                    />
                                ) : (
                                    <div
                                        onClick={() => {
                                            handleChangeDateLimit(datePoint);
                                        }}
                                        className="h-4 flex-grow bg-transparent"
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>
            <div className="flex justify-center">
                {action ? (
                    <img
                        className="cursor-pointer w-10 mt-4"
                        onClick={handleChangeAction}
                        alt="Player"
                        src={pauseSVG}
                    />
                ) : (
                    <img
                        className="cursor-pointer w-10 mt-4"
                        onClick={handleChangeAction}
                        alt="Player"
                        src={playerSVG}
                    />
                )}
            </div>
            <div className="flex justify-end md:mt-2 lg:-mt-4 sm:mt-6 flex-wrap">
                <div className="flex mt-2">
                    <p className="mr-10 text-buslab font-medium">
                        {moment(startsAt).format("DD-MM-YYYY HH:mm")}
                    </p>
                    <p className="text-c7-14">{moment(endsAt).format("DD-MM-YYYY HH:mm")}</p>
                </div>
            </div>
        </div>
    );
};
export default Replay;
