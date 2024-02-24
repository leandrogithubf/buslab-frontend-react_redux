import React from "react";

const StickerBus = ({ list, comparative, bgColor }) => {
    return (
        <>
            {list &&
                Object.values(list).map(
                    vehicle =>
                        vehicle.status === comparative && (
                            <div
                                key={vehicle.identifier}
                                className={`bg-c3 rounded-sm h-8 w-8 mr-6 mb-4 mt-4`}>
                                <p className="font-medium text-12  mb-1 text-center">
                                    {vehicle.line || "N/A"}
                                </p>
                                <div
                                    className={`${bgColor} rounded-full h-8 -mt-1 flex items-center  justify-center`}>
                                    <p className="text-white text-10 font-medium">
                                        {vehicle.prefix}
                                    </p>
                                </div>
                            </div>
                        )
                )}
        </>
    );
};

export default StickerBus;
