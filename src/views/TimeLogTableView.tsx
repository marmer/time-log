import TimeLogService, {TimeLog} from "../core/TimeLogService";
import React from "react";

export interface TimeLogTableViewProps {
    day: Date;
}

interface TimeLogTableViewState {
    timeLogs: TimeLog[];
    isLoadingTimeLogs: boolean;
}

export default class TimeLogTableView extends React.Component<TimeLogTableViewProps, TimeLogTableViewState> {

    constructor(props: Readonly<{ day: Date }>) {
        super(props);
        this.state = {
            timeLogs: [],
            isLoadingTimeLogs: true
        }
    }

    componentDidMount(): void {
        this.setState({
            isLoadingTimeLogs: true
        });
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => this.setState({
                timeLogs,
                isLoadingTimeLogs: false
            }));
    }

    render() {
        return this.state.isLoadingTimeLogs ?
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
                        <button title="remove" onClick={() => this.removeTimelogAt(index)}>-</button>
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
        this.addTimelogBefore(this.state.timeLogs.length + 1);
    }

    private addTimelogBefore(index: number) {
        const timeLogs = [...this.state.timeLogs];
        timeLogs.splice(index, 0, {
            description: "",
            durationInMinutes: 0
        });

        this.setState({
            timeLogs
        })
    }

    private removeTimelogAt(index: number) {
        const timeLogs = [...this.state.timeLogs];
        timeLogs.splice(index, 1);

        this.setState({
            timeLogs
        })
    }
}
