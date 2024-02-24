import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";

export const getGeolocation = search => {
    const { startsAt, endsAt, company, driver, line, vehicle } = search;
    return api.get(`api/realtime-replay/geolocation`, {
        ...HeaderToken(),
        params: {
            startsAt,
            endsAt,
            "company[]": company,
            "employee[]": driver,
            "line[]": line,
            "vehicle[]": vehicle,
        },
    });
};

export const getDates = () => {
    return api.get("api/realtime-replay/dates", HeaderToken());
};
