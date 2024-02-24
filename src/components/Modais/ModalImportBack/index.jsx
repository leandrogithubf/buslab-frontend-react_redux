import React from "react";
import { VscClose } from "react-icons/vsc";

import Container from "./styles";

const ModalImportBack = props => {
    if (!props.show) {
        return null;
    }
    return (
        <Container>
            <main>
                <strong>Importar arquivo</strong>

                <div className="close" onClick={props.onClose}>
                    <VscClose size={30} />
                </div>
                <section> {props.children} </section>
            </main>
        </Container>
    );
};

export default ModalImportBack;
