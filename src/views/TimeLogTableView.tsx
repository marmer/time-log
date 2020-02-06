import {TimeLog} from "../core/TimeLogService";
import React from "react";

export function TimeLogTableView(props: {
    timeLogs: TimeLog[]
}) {
    return <table>
        <thead>
        <tr>
            <th>Duration in Minutes</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {props.timeLogs.map(timeLog => <tr key={timeLog.description}>
            <td>{timeLog.description}</td>
            <td>{timeLog.durationInMinutes}</td>
        </tr>)}
        </tbody>
    </table>;
}
