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
                    <th title={"TimeLog " + index}>{index}</th>
                    <td><input title="duration" type="text" value={timeLog.durationInMinutes}/></td>
                    <td><input title="description" type="text" value={timeLog.description}/></td>
                    <td>
                        <button title="add before" onClick={() => this.addTimelogBefore(index)}>+</button>
                        <button title="remove">-</button>
                    </td>
                </tr>)}
                <tr>
                    <th colSpan={4}>
                        <button title="add" className="fullWidth" onClick={() => this.addTimelog()}>+
                        </button>
                    </th>
                </tr>
                </tbody>
            </table>

    }

    private addTimelog() {
        const timeLogs = [...(this.state.timeLogs as TimeLog[])];
        timeLogs?.push({
            description: "",
            durationInMinutes: 0
        });

        this.setState({
            timeLogs
        })
    }

    private addTimelogBefore(index: number) {
        const timeLogs = [...(this.state.timeLogs as TimeLog[])];
        timeLogs?.splice(index, 0, {
            description: "",
            durationInMinutes: 0
        });

        this.setState({
            timeLogs
        })
    }
}
