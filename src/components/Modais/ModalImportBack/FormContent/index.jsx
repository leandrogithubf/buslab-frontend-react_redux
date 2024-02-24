import React, { useState, useMemo, useCallback } from "react";
import { BiSave } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import { InputStyled } from "../../../Styled/InputStyled ";
import { ButtonDefault, ButtonRed, Container } from "./styles";
import { fillTable } from "./Config/modalTableDataImport";
import Colors from "../../../../assets/constants/Colors";
import api from "../../../../services/api";
import HeaderToken from "../../../../services/headerToken";
import RuntimeEnv from "../../../../config/RuntimeEnv";

function FormContent({ fill, actionModalPost }) {
    const [fileName, setFileName] = useState("");
    const [isInputValue, setIsInputValue] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();
    const onChange = useCallback(e => {
        const file = e.target?.files[0];
        setFileName(file?.name);
    });

    useMemo(() => {
        fileName?.length > 0 && setIsInputValue(!isInputValue);
    }, [fileName]);

    const handleSubmit = useCallback(e => {
        e.preventDefault();
        setIsSubmitting(true);

        const file = e.target["docImage"].files[0];
        const data = new FormData();

        data.append("file", file);
        api.post(fill.uri, data, HeaderToken())
            .then(() => {
                toast.success(`${fileName} enviado com sucesso`);
                document.querySelector("form").reset();
                setFileName();
            })
            .catch(error => {
                toast.error(`${fileName} falhou no envio, tente novamente`);
                setError(error.response.data.message);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    });

    return (
        <Container onSubmit={handleSubmit}>
            <InputStyled fileName={fileName}>
                <label htmlFor="docImage">
                    <input
                        onChange={onChange}
                        accept=".csv"
                        className="hidden "
                        type="file"
                        name="docImage"
                        id="docImage"
                    />
                    {fileName ? `${fileName}` : "arquivo"}
                </label>
                <ButtonDefault
                    type="button"
                    onClick={() => {
                        const input = document.getElementById("docImage");
                        input.click();
                    }}>
                    Procurar
                </ButtonDefault>
            </InputStyled>

            <table>
                <tbody>
                    {fillTable(fill.columns).map(data => (
                        <tr key={data.column}>
                            <td>{data.column}</td>
                            <td>{data.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <a href={RuntimeEnv.BASE_URL + fill.example}>Baixar um arquivo de exemplo</a>
            <p>{error}</p>
            <section>
                {isSubmitting ? (
                    <div>
                        <div>
                            <ClipLoader size={20} color={Colors.buslab} loading={true} />
                        </div>
                    </div>
                ) : (
                    <>
                        <ButtonRed onClick={actionModalPost}>Cancelar</ButtonRed>
                        <ButtonDefault type="submit">
                            <BiSave color="#fff" size="18px" />
                            Salvar
                        </ButtonDefault>
                    </>
                )}
            </section>
        </Container>
    );
}

export default FormContent;
