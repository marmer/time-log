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
        return <div>Day
            <p>{this.props.day.toISOString()}</p>
            <Route render={({history}) =>
                <DatePicker shouldCloseOnSelect
                            todayButton="Today"
                            dateFormat="yyyy-MM-dd"
                            selected={this.props.day}
                            onChange={day => {
                                if (day) history.push(`/days/${moment(day).format("YYYY-MM-DD")}`)
                            }}
                />}/>
        </div>
    }
}
