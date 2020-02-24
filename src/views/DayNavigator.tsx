import {Route} from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import React from "react";

import "react-datepicker/dist/react-datepicker.css";

export interface DayNavigatorProps {
    day: Date;
}

export default function DayNavigator(props: DayNavigatorProps) {
    return <Route render={({history}) =>
        <div>
            <button title="day back"><i className="fa fa-arrow-left"/></button>
            <DatePicker
                dropdownMode={"scroll"}
                showMonthDropdown
                showYearDropdown
                useShortMonthInDropdown
                showWeekNumbers
                todayButton="today"
                dateFormat="yyyy-MM-dd"
                selected={props.day}
                onChange={day => {
                    if (day) {
                        history.push(`/days/${moment(day).format("YYYY-MM-DD")}`);
                        window.location.reload();
                    }
                }}
            />
            <button title="day forward"><i className="fa fa-arrow-right"/></button>
        </div>}/>;
}
