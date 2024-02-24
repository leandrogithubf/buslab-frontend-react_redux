import React from "react";
import { VscClose } from "react-icons/vsc";

import Container from "./styles";

function ModalStyled({ onClose, show, title, children }) {
    if (!show) {
        return <></>;
    }
    return (
        <Container>
            <div className="overflow">
                <main>
                    <span>{title}</span>

                    <div className="close" onClick={onClose}>
                        <VscClose size={30} />
                    </div>
                    <section> {children} </section>
                </main>
            </div>
        </Container>
    );
}
export default ModalStyled;
