import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import {DayNavigator} from "./DayNavigator";

export interface DayViewProps {
    day: Date;
}

export default function DayView(props: DayViewProps) {
    return <div>
        <p>Day</p>
        <DayNavigator day={props.day}/>
    </div>
}
