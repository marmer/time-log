import React from "react";
import DatePicker from "react-datepicker";
import {Route} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export interface DayViewProps {
    day: Date;
}

export default class DayView extends React.Component<DayViewProps> {
    render() {
        return <div>
            <p>Day</p>
            <Route render={({history}) =>
                <DatePicker
                    dropdownMode={"scroll"}
                    showMonthDropdown
                    showYearDropdown
                    useShortMonthInDropdown
                    showWeekNumbers
                    todayButton="today"
                    dateFormat="yyyy-MM-dd"
                    selected={this.props.day}
                    onChange={day => {
                        if (day) history.push(`/days/${moment(day).format("YYYY-MM-DD")}`)
                    }}
                />}/>
        </div>
    }
}
