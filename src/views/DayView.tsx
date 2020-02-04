import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import DayNavigator from "./DayNavigator";
import TimeLogService, {TimeLog} from "../core/TimeLogService";

export interface DayViewProps {
    day: Date;
}


function TimeLogTableView(props: {
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

interface TimeLogTableState {
    timeLogs: TimeLog[]
}

export default class DayView extends React.Component<DayViewProps, TimeLogTableState> {

    constructor(props: Readonly<DayViewProps>) {
        super(props);

        this.state = {
            timeLogs: []
        }
    }

    componentDidMount(): void {
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => this.setState({timeLogs}));
    }

    render() {
        return <div>
            <DayNavigator day={this.props.day}/>
            <TimeLogTableView timeLogs={this.state.timeLogs}/>
            <p>Loading...</p>
        </div>
    }
}
