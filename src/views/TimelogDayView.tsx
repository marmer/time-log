import TimeLogService, {TimeLog} from "../core/TimeLogService";
import React from "react";
import JiraTimeService from "../core/JiraTimeService";
import "./TimelogDayView.css"

import deepEqual from "deep-equal"
import SettingsService from "../core/SettingsService";

export interface TimelogDayViewProps {
    day: Date;
}

interface TimelogInput {
    duration: string;
    description: string;
}

type AsyncValueType<T> = {
    loadingState: "LOADING";
} | {
    loadingState: "ERROR";
    error: Error;
} | {
    loadingState: "DONE";
    value: T;
};

interface TimelogDayViewState {
    timeLogsInput: TimelogInput[];
    timelogs: AsyncValueType<TimeLog[]>
    expectedDailyTimeToLogInMinutes: AsyncValueType<number>;
    expectedTimeToLogDeltaInMonthInMinutesUntilExclusive: AsyncValueType<number>
}

export default class TimelogDayView extends React.Component<TimelogDayViewProps, TimelogDayViewState> {

    private static readonly emptyTimelogInput = {
        description: "",
        duration: ""
    };

    constructor(props: Readonly<{ day: Date }>) {
        super(props);
        this.state = {
            timeLogsInput: [],
            timelogs: {
                loadingState: "LOADING"
            },
            expectedDailyTimeToLogInMinutes: {
                loadingState: "LOADING"
            },
            expectedTimeToLogDeltaInMonthInMinutesUntilExclusive: {
                loadingState: "LOADING"
            }
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
        this.loadTimelogs();
        this.loadExpectedDailyTimeToLogInMinutes();
        this.loadExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive();
    }

    componentDidUpdate(prevProps: Readonly<TimelogDayViewProps>, prevState: Readonly<TimelogDayViewState>,): void {
        if (!deepEqual(this.state.timeLogsInput[this.state.timeLogsInput.length - 1], TimelogDayView.emptyTimelogInput)) {
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
                this.state.timelogs.loadingState === "LOADING" ?
                    <p>Loading...</p> :
                    this.state.timelogs.loadingState === "ERROR" ?
                        <p>Try reloading... {this.state.timelogs.error.toString()}</p> :
                        <table className="table table-sm">
                            <thead>
                            <tr>
                                <th scope="col" className="text-sm-center">#</th>
                                <th scope="col" className="text-sm-center">Start Time</th>
                                <th scope="col"
                                    className="text-sm-center">Duration <em>{this.getDurationSumAsJiraFormat()}</em>
                                </th>
                                <th scope="col" className="text-sm-center">Description</th>
                                <th scope="col" className="text-sm-center">Issue</th>
                                <th scope="col" className="text-sm-center">Notes</th>
                                <th scope="col" className="text-sm-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.timeLogsInput.map((timeLog, index) => <tr
                                key={index}>
                                <th className="text-sm-center" title={"TimeLog " + index}>{index}</th>
                                <td><input className={"fullWidth"} disabled title="start time" placeholder="09:15"/>
                                </td>
                                <td><input
                                    className={"fullWidth" + (JiraTimeService.isValidJiraFormat(timeLog.duration) ? "" : " invalid-format")}
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
                                <button className="btn btn-outline-primary" title="add before this entry"
                                        onClick={() => this.addTimelogBefore(index)}
                                        type="button">
                                    <i className="fa fa-plus-circle"/>
                                </button>
                                {index < this.state.timeLogsInput.length - 1 ?
                                    <button className="btn btn-outline-primary" title="remove this entry"
                                            onClick={() => this.removeTimelogAt(index)}
                                            type="button">
                                        <i className="fa fa-minus-circle"/>
                                    </button> : <></>}
                            </span>
                                </td>
                            </tr>)}
                            <tr>
                                <th colSpan={7}>
                                    <button className="btn btn-primary fullWidth" title="save"
                                            disabled={this.isAnyTimelogInValid()}
                                            type={"submit"}
                                    ><i className="fa fa-save"/> save
                                    </button>
                                </th>
                            </tr>
                            </tbody>
                        </table>}</form>

            <section className="stats">
                <label>
                    Time to log by daily expectation: <input disabled title={"time left today only"}
                                                             value={this.getDailyExpectationViewValue()}/>
                </label>
                <label>
                    Time to log by monthly expectation till today: <input disabled title={"time left monthly"}
                                                                          value={this.getExpectedTimeToLogConsideringTheWholeMonthTillTodayViewValue()}/>
                </label>
            </section>
        </div>

    }

    private loadExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive() {
        this.setState({
            expectedTimeToLogDeltaInMonthInMinutesUntilExclusive: {
                loadingState: "LOADING",
            }
        });
        TimeLogService.getExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive(this.props.day)
            .then(delta => this.setState({
                expectedTimeToLogDeltaInMonthInMinutesUntilExclusive: {
                    loadingState: "DONE",
                    value: delta
                }
            }))
            .catch(error => {
                this.setState({
                    expectedTimeToLogDeltaInMonthInMinutesUntilExclusive: {
                        loadingState: "ERROR",
                        error
                    }
                })
            });
    }

    private loadTimelogs() {
        this.setState({
            timelogs: {loadingState: "LOADING"}
        });
        TimeLogService.getTimeLogsForDay(this.props.day)
            .then(timeLogs => {
                this.setState({
                    timeLogsInput: timeLogs.length === 0 ? [{...TimelogDayView.emptyTimelogInput}] : timeLogs.map((timeLog) => TimelogDayView.toTimelogInput(timeLog)),
                    timelogs: {
                        loadingState: "DONE",
                        value: timeLogs
                    },
                });
            })
            .catch(error => {
                this.setState({
                    timelogs: {
                        loadingState: "ERROR",
                        error
                    }
                })
            });
    }

    private loadExpectedDailyTimeToLogInMinutes() {
        this.setState({
            expectedDailyTimeToLogInMinutes: {
                loadingState: "LOADING"
            }
        });
        SettingsService.getExpectedDailyTimelogInMinutes()
            .then(expectedTime => this.setState({
                expectedDailyTimeToLogInMinutes: {
                    loadingState: "DONE",
                    value: expectedTime
                }
            }))
            .catch(error => this.setState({
                expectedDailyTimeToLogInMinutes: {
                    loadingState: "ERROR",
                    error
                }
            }));
    }

    private getDailyExpectationViewValue() {

        switch (this.state.expectedDailyTimeToLogInMinutes.loadingState) {
            case "LOADING":
                return "Loading...";
            case "DONE":
                return JiraTimeService.minutesToJiraFormat(
                    this.state.expectedDailyTimeToLogInMinutes.value - this.getDurationSum()
                );
            case "ERROR":
            default:
                return this.state.expectedDailyTimeToLogInMinutes.error.toString();
        }
    }

    private getExpectedTimeToLogTodayOnly() {
        return this.state.expectedDailyTimeToLogInMinutes.loadingState === "DONE" ?
            this.state.expectedDailyTimeToLogInMinutes.value - this.getDurationSum() :
            0;
    }

    private getExpectedTimeToLogConsideringTheWholeMonthTillTodayViewValue() {
        if (this.state.expectedTimeToLogDeltaInMonthInMinutesUntilExclusive.loadingState === "LOADING" || this.state.expectedDailyTimeToLogInMinutes.loadingState === "LOADING") {
            return "Loading...";
        } else if (this.state.expectedTimeToLogDeltaInMonthInMinutesUntilExclusive.loadingState === "DONE" && this.state.expectedDailyTimeToLogInMinutes.loadingState === "DONE") {
            return JiraTimeService.minutesToJiraFormat(this.state.expectedTimeToLogDeltaInMonthInMinutesUntilExclusive.value + this.getExpectedTimeToLogTodayOnly());
        } else if (this.state.expectedDailyTimeToLogInMinutes.loadingState === "ERROR") {
            return this.state.expectedDailyTimeToLogInMinutes.error.toString();
        } else if (this.state.expectedTimeToLogDeltaInMonthInMinutesUntilExclusive.loadingState === "ERROR")
            return this.state.expectedTimeToLogDeltaInMonthInMinutesUntilExclusive.error.toString();
    }

    private addTimelog() {
        this.addTimelogBefore(this.state.timeLogsInput.length + 1);
    }

    private store() {
        TimeLogService.saveTimeLogsForDay(this.props.day, this.state.timeLogsInput
            // the last one is always empty ;)
            .slice(0, this.state.timeLogsInput.length - 1)
            .map(timelogInput => (TimelogDayView.toTimelog(timelogInput))))
            .then(timeLogs => this.setState({
                timeLogsInput: timeLogs.map(timeLog => TimelogDayView.toTimelogInput(timeLog))
            }));
        // TODO: marmer 23.02.2020 error handling!
    }

    private addTimelogBefore(index: number) {
        const timeLogs = [...this.state.timeLogsInput];
        timeLogs.splice(index, 0, {...TimelogDayView.emptyTimelogInput});

        this.setState({
            timeLogsInput: timeLogs
        })
    }

    private removeTimelogAt(index: number) {
        const timeLogs = [...this.state.timeLogsInput];
        timeLogs.splice(index, 1);

        this.setState({
            timeLogsInput: timeLogs
        })
    }

    private updateDuration(index: number, value: string) {
        const timeLogs = [...this.state.timeLogsInput];
        timeLogs[index].duration = value;
        this.setState({
            timeLogsInput: timeLogs
        })
    }

    private updateDescription(index: number, value: string) {
        const timeLogs = [...this.state.timeLogsInput];
        timeLogs[index].description = value;
        this.setState({
            timeLogsInput: timeLogs
        })
    }

    private isAnyTimelogInValid() {
        return !this.isEachTimeLogValid();
    }

    private isEachTimeLogValid() {
        return this.state.timeLogsInput
            .map(timeLog => JiraTimeService.isValidJiraFormat(timeLog.duration))
            .reduce((v1, v2) => v1 && v2, true);
    }

    private getDurationSumAsJiraFormat() {
        return JiraTimeService.minutesToJiraFormat(this.getDurationSum());
    }

    private getDurationSum() {
        return this.state.timeLogsInput
            .map(({duration}) => JiraTimeService.isValidJiraFormat(duration) ? JiraTimeService.jiraFormatToMinutes(duration) : 0)
            .reduce((d1, d2) => d1 + d2, 0);
    }
}
