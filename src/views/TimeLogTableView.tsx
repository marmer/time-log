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
        return <form target="_self" onSubmit={() => {
            this.store();
            return false
        }}>{
            this.state.isLoadingTimeLogs ?
                <p>Loading...</p> :
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th scope="col" className="text-sm-center">#</th>
                        <th scope="col" className="text-sm-center">Duration in Minutes</th>
                        <th scope="col" className="text-sm-center">Description</th>
                        <th scope="col" className="text-sm-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.timeLogs.map((timeLog, index) => <tr
                        key={index}>
                        <th className="text-sm-center" title={"TimeLog " + index}>{index}</th>
                        <td><input className="fullWidth" title="duration" type="text"
                                   inputMode="numeric"
                                   value={timeLog.durationInMinutes}
                                   onChange={event => this.updateDuration(index, event.target.value)}/></td>
                        <td><input className="fullWidth" title="description" type="text" value={timeLog.description}
                                   onChange={event => this.updateDescription(index, event.target.value)}/>
                        </td>
                        <td>
                            <span className="btn-group actions">
                                <button className="btn btn-outline-primary" title="add before"
                                        onClick={() => this.addTimelogBefore(index)}
                                        type="button">+
                                </button>
                                <button className="btn btn-outline-primary" title="remove"
                                        onClick={() => this.removeTimelogAt(index)}
                                        type="button">-
                                </button>
                            </span>
                        </td>
                    </tr>)}
                    <tr>
                        <th colSpan={4}>
                            <button className="btn btn-outline-primary fullWidth"
                                    type="button"
                                    title="add"
                                    onClick={() => this.addTimelog()}>+
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={4}>
                            <button className="btn btn-primary fullWidth" title="save"
                                    type={"submit"}
                            >save
                            </button>
                        </th>
                    </tr>
                    </tbody>
                </table>}</form>

    }

    private addTimelog() {
        this.addTimelogBefore(this.state.timeLogs.length + 1);
    }

    private store() {
        TimeLogService.storeTimeLogsForDay(this.props.day, this.state.timeLogs)
            .then(timeLogs => this.setState({
                timeLogs
            }));
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

    private updateDuration(index: number, value: string) {
        const timeLogs = [...this.state.timeLogs];
        timeLogs[index].durationInMinutes = Number.parseInt(value);
        this.setState({
            timeLogs
        })
    }

    private updateDescription(index: number, value: string) {
        const timeLogs = [...this.state.timeLogs];
        timeLogs[index].description = value;
        this.setState({
            timeLogs
        })
    }
}
