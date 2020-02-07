import TimeLogService, {TimeLog} from "../core/TimeLogService";
import React from "react";

export interface TimeLogTableViewProps {
    day: Date;
}

interface TimeLogTableViewState {
    timeLogs: TimeLog[] | null;
}

export default class TimeLogTableView extends React.Component<TimeLogTableViewProps, TimeLogTableViewState> {

    constructor(props: Readonly<{ day: Date }>) {
        super(props);
        this.state = {timeLogs: null}
    }

    componentDidMount(): void {
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => this.setState({
                timeLogs
            }));
    }

    render() {
        return this.state.timeLogs === null ?
            <p>Loading...</p> :
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Duration in Minutes</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {this.state.timeLogs.map((timeLog, index) => <tr
                    key={index}>
                    <th>{index}</th>
                    <td><input type="text" value={timeLog.description}/></td>
                    <td><input type="text" value={timeLog.durationInMinutes}/></td>
                    <td>
                        <button>+</button>
                        <button>-</button>
                    </td>
                </tr>)}
                {/*<tfoot>*/}
                <tr>
                    <th colSpan={4}>
                        <button className="fullWidth">+</button>
                    </th>
                </tr>
                {/*</tfoot>*/}
                </tbody>
            </table>

    }
}
