import styled from "styled-components";

export const Menu = styled.div`
    position: absolute;
    display: flex;
    width: auto;
    height: 40px;
    top: 15%;
    left: 1%;

    button {
        color: #3b3b3b;
        padding: 0 6px;
        font-size: 20px;
        background-color: #fff;
        border-radius: 2px;
        margin-right: 2px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));

        transition: all 0.3s;
        &:hover {
            color: #222222;
            background-color: #ececec;
        }
    }
`;
