/**
 *
 * @param {Object} obj
 * @param {string} labelFieldName
 * @param {string} valueFieldName
 */
export const objToSelect = (obj, labelFieldName = "description", valueFieldName = "identifier") => {
    return (
        obj && {
            label: obj[labelFieldName],
            value: obj[valueFieldName],
        }
    );
};
/**
 *
 * @param {Object} entity
 */
export const getSelectValues = entity => {
    const aux = { ...entity };
    for (let field in aux) {
        aux[field] = aux[field]?.value || (aux[field]?.value === "" ? "" : aux[field]);
    }

    return aux;
};
