import api from "./api";
import HeaderToken from "./headerToken";
import Interceptor from "./interceptor";
import { keepNumbersAndSpaces } from "../assets/utils/format/removeSpecialChars";

export const fileDownload = ({ route, filename, ext, search }) => {
    api.get(route, {
        ...HeaderToken(),
        responseType: "arraybuffer",
        params: search,
    })
        .then(function (response) {
            const blob = new Blob([response.data], {
                type: `application/${ext}`,
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = keepNumbersAndSpaces(filename) + "." + ext;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(e => Interceptor(e));
};
