import TimeLogService, {TimeLog} from "../core/TimeLogService";
import React from "react";
import JiraTimeService from "../core/JiraTimeService";

import deepEqual from "deep-equal"

export interface TimelogDayViewProps {
    day: Date;
}

interface TimelogInput {
    duration: string;
    description: string;
}

interface TimelogDayViewState {
    timeLogs: TimelogInput[];
    isLoadingTimeLogs: boolean;
}

export default class TimelogDayView extends React.Component<TimelogDayViewProps, TimelogDayViewState> {

    private static readonly emptyTimelogInput = {
        description: "",
        duration: ""
    };

    constructor(props: Readonly<{ day: Date }>) {
        super(props);
        this.state = {
            timeLogs: [],
            isLoadingTimeLogs: true
        }
    }

    private static toTimelog(timelogInput: TimelogInput): TimeLog {
        return {
            description: timelogInput.description,
            durationInMinutes: JiraTimeService.jiraFormatToMinutes(timelogInput.duration)
        };
    }

    private static toTimelogInput({description, durationInMinutes}: TimeLog) {
        return {
            description,
            duration: JiraTimeService.minutesToJiraFormat(durationInMinutes)
        };
    }

    componentDidMount(): void {
        this.setState({
            isLoadingTimeLogs: true
        });
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => {
                this.setState({
                    timeLogs: timeLogs.length === 0 ? [{...TimelogDayView.emptyTimelogInput}] : timeLogs.map((timeLog) => TimelogDayView.toTimelogInput(timeLog)),
                    isLoadingTimeLogs: false
                });
            });
    }

    componentDidUpdate(prevProps: Readonly<TimelogDayViewProps>, prevState: Readonly<TimelogDayViewState>,): void {
        if (!deepEqual(this.state.timeLogs[this.state.timeLogs.length - 1], TimelogDayView.emptyTimelogInput)) {
            this.addTimelog();
        }
    }

    render() {
        return <div onKeyDown={e => {
            if (e.ctrlKey && e.key === "s") {
                this.store();
            }
        }}>
            <form target="_self" onSubmit={() => {
                if (this.isEachTimeLogValid())
                    this.store();
                return false
            }}>{
                this.state.isLoadingTimeLogs ?
                    <p>Loading...</p> :
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th scope="col" className="text-sm-center">#</th>
                            <th scope="col" className="text-sm-center">Start Time</th>
                            <th scope="col" className="text-sm-center">Duration</th>
                            <th scope="col" className="text-sm-center">Description</th>
                            <th scope="col" className="text-sm-center">Issue</th>
                            <th scope="col" className="text-sm-center">Notes</th>
                            <th scope="col" className="text-sm-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.timeLogs.map((timeLog, index) => <tr
                            key={index}>
                            <th className="text-sm-center" title={"TimeLog " + index}>{index}</th>
                            <td><input className={"fullWidth"} disabled title="start time" placeholder="09:15"/></td>
                            <td><input
                                className={"fullWidth" + (JiraTimeService.isValidJiraFormat(timeLog.duration) ? "" : " invalid-format alert-danger")}
                                title="duration" type="text"
                                placeholder={"5h 15m"}
                                value={timeLog.duration}
                                onChange={event => this.updateDuration(index, event.target.value)}/></td>
                            <td><input className="fullWidth" title="description" type="text"
                                       placeholder={"What did you to here"} value={timeLog.description}
                                       onChange={event => this.updateDescription(index, event.target.value)}/>
                            </td>
                            <td><input className={"fullWidth"} disabled title="issue"
                                       placeholder={"e.g. ISSUEID-123"}/></td>
                            <td><input className={"fullWidth"} disabled title="notes"
                                       placeholder={"Not supposed to get exported"}/></td>
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
                            <th colSpan={7}>
                                <button className="btn btn-primary fullWidth" title="save"
                                        disabled={this.isAnyTimelogInValid()}
                                        type={"submit"}
                                >save
                                </button>
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={7}>
                                Overtime: 5h 10m
                            </th>
                        </tr>
                        </tbody>
                    </table>}</form>
        </div>

    }

    private addTimelog() {
        this.addTimelogBefore(this.state.timeLogs.length + 1);
    }

    private store() {
        TimeLogService.saveTimeLogsForDay(this.props.day, this.state.timeLogs
            // the last one is always empty ;)
            .slice(0, this.state.timeLogs.length - 1)
            .map(timelogInput => (TimelogDayView.toTimelog(timelogInput))))
            .then(timeLogs => this.setState({
                timeLogs: timeLogs.map(timeLog => TimelogDayView.toTimelogInput(timeLog))
            }));
    }

    private addTimelogBefore(index: number) {
        const timeLogs = [...this.state.timeLogs];
        timeLogs.splice(index, 0, {...TimelogDayView.emptyTimelogInput});

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
        timeLogs[index].duration = value;
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

    private isAnyTimelogInValid() {
        return !this.isEachTimeLogValid();
    }

    private isEachTimeLogValid() {
        return this.state.timeLogs
            .map(timeLog => JiraTimeService.isValidJiraFormat(timeLog.duration))
            .reduce((v1, v2) => v1 && v2, true);
    }
}
