import { toast } from "react-toastify";

const Interceptor = error => {
    if (error.response && error.response.status === 401) {
        window.localStorage.removeItem("session-user-name");
        window.localStorage.removeItem("session-token");
        window.location.href = "/login";
    } else {
        //console.log(error.response.data)
        error.response.data.errors.forEach((error)=>{
            toast.warning(error.message);
        })
        //toast.info("Algo deu errado, tente novamente mais tarde!");
    }
    return Promise.reject(error);
};

export default Interceptor;
