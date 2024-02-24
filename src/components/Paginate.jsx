import React from "react";
import ButtonPaginate from "./Buttons/default/ButtonPaginate";
import {
    MdFastForward,
    MdFastRewind,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";

const Paginate = ({ setMeta, meta, action, setAction }) => {
    const setNewMeta = meta => {
        setMeta({
            ...meta,
            current_page: meta,
        });
        setAction(!action);
    };

    return (
        <div className="flex mt-3 justify-center">
            <ButtonPaginate
                disabled={meta.current_page === 1}
                onClick={() => {
                    setNewMeta(1);
                    window.scrollTo(0, 0);
                }}>
                <MdFastRewind />
            </ButtonPaginate>
            <ButtonPaginate
                disabled={meta.current_page === 1}
                onClick={() => {
                    setNewMeta(meta.current_page - 1);
                    window.scrollTo(0, 0);
                }}>
                <MdKeyboardArrowLeft />
            </ButtonPaginate>

            <ButtonPaginate
                disabled={meta.current_page === meta.total_pages}
                onClick={() => {
                    setNewMeta(meta.current_page + 1);
                    window.scrollTo(0, 0);
                }}>
                <MdKeyboardArrowRight />
            </ButtonPaginate>
            <ButtonPaginate
                disabled={meta.current_page === meta.total_pages}
                onClick={() => {
                    setNewMeta(meta.total_pages);
                    window.scrollTo(0, 0);
                }}>
                <MdFastForward />
            </ButtonPaginate>
        </div>
    );
};

export default Paginate;
