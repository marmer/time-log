import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import {DayNavigator} from "./DayNavigator";

export interface DayViewProps {
    day: Date;
}


function TimeLogTableView(props: {
    timeLogs: { durationInMinutes: number, description: string }[]
}) {
    return <table>
        <thead>
        <tr>
            <th>Duration in Minutes</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {props.timeLogs.map(timeLog => <tr>
            <td>{timeLog.description}</td>
            <td>{timeLog.durationInMinutes}</td>
        </tr>)}
        </tbody>
    </table>;
}

export default function DayView(props: DayViewProps) {
    return <div>
        <DayNavigator day={props.day}/>
        <TimeLogTableView timeLogs={[{
            durationInMinutes: 5, description: "foo"
        }, {
            durationInMinutes: 42, description: "bar"
        }]}/>
    </div>
}
