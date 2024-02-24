import { useEffect, useState } from "react";

export function getNewSearch(searchObj) {
    return Object.entries(searchObj).reduce((acc, [key, value]) => {
        if (!value) {
            return acc;
        }
        let newKey;
        switch (key) {
            case "brand":
                newKey = "brand[]";
                break;
            case "cellphoneNumber":
                newKey = "cellphoneNumber[]";
                break;
            case "collaborators":
                newKey = "collaborators[]";
                break;
            case "collector":
                newKey = "collector[]";
                break;
            case "company":
                newKey = "company[]";
                break;
            case "event":
                newKey = "event[]";
                break;
            case "driver":
                newKey = "driver[]";
                break;
            case "line":
                newKey = "line[]";
                break;
            case "modalityEmployee":
                newKey = "modalityEmployee[]";
                break;
            case "model":
                newKey = "model[]";
                break;
            case "occurrenceType":
                newKey = "occurrenceType[]";
                break;
            case "obd":
                newKey = "obd[]";
                break;
            case "sector":
                newKey = "sector[]";
                break;
            case "vehicle":
                newKey = "vehicle[]";
                break;
            default:
                newKey = key;
        }
        return { ...acc, [newKey]: value };
    }, {});
}
export default function useFilterFormat(search) {
    const [newSearch, setNewSearch] = useState(search);

    useEffect(() => {
        if (search !== newSearch) {
            setNewSearch(getNewSearch(search));
        }
    }, [search]);
    return newSearch;
}
