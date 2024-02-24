const filterData = (data, search) =>
    (search.vehicle ? search.vehicle === data.identifier : true) &&
    (search.line ? search.line === data.lineIdentifier : true) &&
    (search.driver ? search.driver === data.driverIdentifier : true) &&
    (search.company ? search.company === data.company : true);

export function filterPositions(socketData, search) {
    return (
        Object.entries(socketData)
            .filter(([key, data]) => filterData(data[data.length - 1], search))
            // back to be object
            .reduce((acc, [key, data]) => ({ ...acc, [key]: data }), {})
    );
}
export function filterStatus(socketData, search) {
    return (
        Object.entries(socketData)
            .filter(([_, data]) => filterData(data, search))
            // back to be object
            .reduce((acc, [key, data]) => ({ ...acc, [key]: data }), {})
    );
}
