import React from "react";
import { Formik, Form, useFormikContext } from "formik";
import { format, isValid } from "date-fns";

import Colors from "../../assets/constants/Colors";
import { DatePickerStyle } from "../../assets/library/datepicker/styled";
import { DatePickerStyleMultiple } from "../../assets/library/datepicker-multiple/styled";
import Locale from "./Locale";

// const DatePickerPeriod = ({ onChange, selected }) => {
//     console.log({ selected, onChange });
//     return (
//         <DatePickerStyle
//             selected={selected}
//             locale="pt"
//             className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
//             onChange={select => {
//                 console.log({ select });
//                 onChange(select);
//             }}
//             type="date"
//             dateFormat="dd/MM/yyyy"
//         />
//     );
// };

const DatePickerWithHour = ({ onChange, selected }) => {
    return (
        <DatePickerStyle
            selected={selected}
            locale="pt"
            className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
            onChange={select => onChange(select)}
            type="date"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Horário"
            use12Hours={true}
            dateFormat="dd/MM/yyyy HH:mm"
        />
    );
};

/**
 * react-modern-calendar-datepicker
 * DatePicker was adapted to have the same properties as the old one.
 */
function DatePickerPeriod({
    name = "date",
    selected,
    onChange = () => {},
    calendarPopperPosition,
}) {
    const formik = useFormikContext();

    const renderInputMultiple = (ref, value) => (
        <input
            readOnly
            ref={ref}
            className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
            value={isValid(value) ? format(value, "dd/MM/yyyy") : ""}
        />
    );

    return (
        <DatePickerStyleMultiple
            colorPrimary={Colors.buslab}
            locale={Locale}
            onChange={value => {
                const newValue = new Date(`${value.year}/${value.month}/${value.day}`);
                onChange(newValue);
                formik.setFieldValue(name, newValue);
            }}
            renderInput={({ ref }) => renderInputMultiple(ref, selected)}
            shouldHighlightWeekends
            calendarPopperPosition={calendarPopperPosition}
        />
    );
}

/**
 * react-modern-calendar-datepicker formik use example
 */
function ModernDatePicker() {
    return (
        <Formik
            initialValues={{
                date: "",
            }}
            onSubmit={values => console.log(values)}>
            <Form>
                <DatePickerPeriod name="date" />
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    );
}

export { DatePickerWithHour, DatePickerPeriod };
