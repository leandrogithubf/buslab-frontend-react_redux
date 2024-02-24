import styled from "styled-components";
import colors from "../../../../assets/constants/Colors";

export default styled.div`
    display: flex;
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 2000;
    padding: 10px;

    min-height: 100%;
    min-width: 100%;
    background: rgba(0, 0, 0, 0.3);

    main {
        display: grid;
        grid-template-columns: 7fr 1fr;
        grid-template-rows: 30px 1fr;
        grid-template-areas:
            "title  close"
            "children children";
        align-items: center;
        padding: 15px;
        width: fit-content;
        min-width: 50%;
        background-color: #fff;
        overflow: visible;
        margin: auto;
        border-radius: 4px;

        strong {
            color: ${colors.C5};
            grid-area: title;
            font-size: 16px;
        }
        div {
            grid-area: close;
            justify-self: center;
            cursor: pointer !important;
            svg {
                color: ${colors.C6};
            }
        }
        section {
            position: relative;
            grid-area: children;
            padding: 10px 0px;
        }
    }
    .overflow {
        flex: 1;
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 95%;
        overflow: auto;
    }
    .overflow::-webkit-scrollbar {
        display: none;
    }
    .overflow {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
`;
