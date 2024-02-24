import React from "react";
import Colors from "../../assets/constants/Colors";
import Locale from "./Locale";
import { DatePickerStyleMultiple } from "../../assets/library/datepicker-multiple/styled";
const renderInputMultiple = (ref, value) => (
    <input
        readOnly
        ref={ref}
        className="appearance-none block w-full text-gray-700 border border-gray-300 py-2 px-4 mb-3 focus:outline-none focus:bg-white"
        value={value}
    />
);

const DatePickerMultiple = ({ calendarPopperPosition, onChange, selected, value }) => {
    return (
        <DatePickerStyleMultiple
            locale={Locale}
            value={selected}
            colorPrimary={Colors.buslab}
            onChange={select => onChange(select)}
            renderInput={({ ref }) => renderInputMultiple(ref, value)}
            calendarPopperPosition={calendarPopperPosition}
            shouldHighlightWeekends
        />
    );
};

export { DatePickerMultiple };
