import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import DayNavigator from "./DayNavigator";
import TimeLogService, {TimeLog} from "../core/TimeLogService";
import {TimeLogTableView} from "./TimeLogTableView";

export interface DayViewProps {
    day: Date;
}


interface TimeLogTableState {
    timeLogs: TimeLog[] | null
}

export default class DayView extends React.Component<DayViewProps, TimeLogTableState> {

    constructor(props: Readonly<DayViewProps>) {
        super(props);

        this.state = {
            timeLogs: null
        }
    }

    componentDidMount(): void {
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => this.setState({timeLogs}));
    }

    render() {
        return <div>
            <DayNavigator day={this.props.day}/>
            {this.state.timeLogs === null ?
                <p>Loading...</p> :
                <TimeLogTableView timeLogs={this.state.timeLogs}/>
            }
        </div>
    }
}
