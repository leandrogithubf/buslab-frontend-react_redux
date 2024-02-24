import styled from "styled-components";
import Colors from "../../../../assets/constants/Colors";

const tableColors = {
    tableEven: "#f7f7f7",
    tableTdEven: "#757575",
    tableTdOdd: "#2c2c2c",
};
const buttonColor = {
    cancel: "#e75150",
};
export const Container = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #fff;
    margin: auto;
    max-width: 500px;

    table {
        width: 100%;
        table-layout: fixed;
        overflow-wrap: break-word;

        tr:nth-child(even) {
            background-color: ${tableColors.tableEven};
        }

        td {
            text-align: left;
            padding: 12px;
            color: ${tableColors.tableTdEven};
            font-weight: 300;
        }
        td:nth-child(odd) {
            color: ${tableColors.tableTdOdd};
            font-weight: 500;
        }
    }
    a {
        color: blue;
        text-decoration: underline;
        font-size: 13px;
    }
    p {
        color: red;

        font-size: 13px;
    }

    section {
        display: flex;
        justify-content: space-between;
        width: 50%;
        align-self: flex-end;
        height: 40px;
    }
`;

export const ButtonRed = styled.button`
    background-color: ${buttonColor.cancel};
    color: #fff;
    border-radius: 0.25rem;
    height: 40px;
    width: 100px;
    font-size: 14px;
    margin-right: 3px;
`;

export const ButtonDefault = styled.button`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: ${Colors.botao};
    color: #fff;
    border-radius: 0.25rem;
    padding: 0px 13px;
    height: 40px;
    width: 100px;
    font-size: 14px;
`;
