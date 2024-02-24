import {  useLayoutEffect, useState } from "react";
import { getNewSearch } from "../../../../hooks/useFilterFormat";
import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import Interceptor from "../../../../services/interceptor";

/**
 *
 * @param {String} route api route
 * @param {Object} search query params
 */
export function useChartApi(route, search) {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);

    useLayoutEffect(() => {
        setLoad(true);
        api.get(route, {
            ...HeaderToken(),
            params: getNewSearch(search),
        })
            .then(res => {
                res.data && setData(res.data);
            })
            .catch(e => Interceptor(e))
            .finally(() => {
                setLoad(false);
            });
    }, [route, search]);

    return [data, load];
}
