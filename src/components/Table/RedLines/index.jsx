import styled, { css } from "styled-components";
import { isBefore } from "date-fns";

import Colors from "../../../assets/constants/Colors";
export const RedLines = styled.tr`
    ${({ red }) =>
        red &&
        css`
            background: ${Colors.vermelho};
            td {
                color: #000;
            }
        `};
`;
// TEMP
export const dateDiffTrip = (estimated, real) => {
    if (estimated && real) {
        const newEstimated = new Date(`${real.split(" ")[0]} ${estimated.split(" ")[1]}`);
        const newReal = new Date(real);

        return isBefore(newReal, newEstimated) ? false : true;
    }
    return false;
};
export function dateDiff(before, after) {
    if (before && after) {
        const newBefore = before instanceof Date ? before : new Date(before);
        const newAfter = after instanceof Date ? after : new Date(after);
        return isBefore(newBefore, newAfter) ? false : true;
    }
    return false;
}
export function numberDiff(minor, major) {
    return minor < major ? false : true;
}
