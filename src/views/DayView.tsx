import React from "react";
import DayNavigator from "./DayNavigator";
import TimelogDayView from "./TimelogDayView";

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
        return <div className="">
            <div className="card-header d-flex justify-content-center">
                <DayNavigator day={this.props.day}/>
            </div>

            <div className="card-body">
                <TimelogDayView day={this.props.day}/>
            </div>
        </div>
    }
}
