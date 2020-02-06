import React from "react";
import DayNavigator from "./DayNavigator";
import TimeLogTableView from "./TimeLogTableView";

export interface DayViewProps {
    day: Date;
}


export default class DayView extends React.Component<DayViewProps> {

    constructor(props: Readonly<DayViewProps>) {
        super(props);

        this.state = {
            timeLogs: null
        }
    }

    render() {
        return <div>
            <DayNavigator day={this.props.day}/>
            <TimeLogTableView day={this.props.day}/>
        </div>
    }
}
