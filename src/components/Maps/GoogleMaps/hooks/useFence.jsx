import { useEffect, useState } from "react";
import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import Interceptor from "../../../../services/interceptor";

function useFence() {
    const [fences, setFences] = useState();

    function getOldFence(markersString) {
        let markers = JSON.parse(markersString);

        markers = markers.id
            ? markers.geometry.coordinates.reduce(
                  (acc, coord) => [
                      ...acc,
                      ...coord.map(co => ({
                          longitude: co[0],
                          latitude: co[1],
                      })),
                  ],
                  []
              )
            : markers;

        return markers;
    }
    useEffect(() => {
        function getData(route) {
            api.get(route, HeaderToken())
                .then(response => {
                    setFences(
                        response.data.data.reduce(
                            (acc, fence) => ({
                                ...acc,
                                [`${fence.description}||${fence.identifier}`]: getOldFence(
                                    fence.markers
                                ),
                            }),
                            {}
                        )
                    );
                })
                .catch(error => {
                    Interceptor(error);
                });
        }

        getData(`/api/adm/company/fence`);
    }, []);
    return { setFences, fences };
}

export default useFence;
