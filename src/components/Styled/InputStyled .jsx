import styled from "styled-components";
import Colors from "../../assets/constants/Colors";

export const InputStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    input[type="file"] {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    label {
        border: 1px solid #dddd;
        padding: 8px 20px;
        width: 100%;
        border-radius: 0.25rem;
        color: ${({ fileName }) => {
            return fileName?.length > 0 ? "#000 " : "#bbbbbb";
        }};
        font-size: 14px;
        transition: all 0.4s;
        justify-content: center;

        margin-right: 6px;
        cursor: pointer;
    }
    input[type="file"] + label {
        cursor: pointer; /* "hand" cursor */
    }
`;
