const HeaderToken = () => {
    return {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("session-token")}`,
        },
    };
};

export default HeaderToken;
