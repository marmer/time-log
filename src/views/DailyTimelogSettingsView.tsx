import React, {useEffect, useState} from "react";
import SettingsService from "../core/SettingsService";
import JiraTimeService from "../core/JiraTimeService";
import {AsyncValueType} from "./AsyncValueType";

export default function DailyTimelogSettingsView() {
    const loadingPlaceholder = "Loading...";

    const [expectedDailyTimelogInMinutes, setExpectedDailyTimelogInMinutes] = useState<AsyncValueType<string>>({
        loadingState: "LOADING",
    });

    useEffect(() => {
        setExpectedDailyTimelogInMinutes({
            loadingState: "LOADING",
        });
        SettingsService.getExpectedDailyTimelogInMinutes()
            .then(minutes => {
                setExpectedDailyTimelogInMinutes({
                    loadingState: "DONE",
                    value: JiraTimeService.minutesToJiraFormat(minutes)
                });
            })
    }, []);
    return <div className="card">
        <div className="card-header">
            Day Settings
        </div>
        <div className="form-group row card-body">
            <form onSubmit={_ => {
                if (expectedDailyTimelogInMinutes.loadingState === "DONE")
                    SettingsService.setExpectedDailyTimelogInMinutes(JiraTimeService.jiraFormatToMinutes(expectedDailyTimelogInMinutes.value));
                return false;
            }}>
                <div className="d-flex flex-column">
                    <label>Expected Time to log per day <input id="expectedTimeToLog" type="text"
                                                               className={(JiraTimeService.isValidJiraFormat((expectedDailyTimelogInMinutes as any).value) ? "" : " invalid-format")}
                                                               disabled={expectedDailyTimelogInMinutes.loadingState !== "DONE"}
                                                               value={expectedDailyTimelogInMinutes.loadingState === "DONE" ? expectedDailyTimelogInMinutes.value : loadingPlaceholder}
                                                               onChange={({target}) => setExpectedDailyTimelogInMinutes({
                                                                   ...expectedDailyTimelogInMinutes,
                                                                   loadingState: "DONE",
                                                                   value: target.value
                                                               })}
                                                               placeholder="e.g. 7h 30m"/>
                    </label>
                    <label>
                        <input type="checkbox"/> Monday
                    </label>
                    <label>
                        <input type="checkbox"/> Tuesday
                    </label>
                    <label>
                        <input type="checkbox"/> Wednesday
                    </label>
                    <label>
                        <input type="checkbox"/> Thursday
                    </label>
                    <label>
                        <input type="checkbox"/> Friday
                    </label>
                    <label>
                        <input type="checkbox"/> Saturday
                    </label>
                    <label>
                        <input type="checkbox"/> Sunday
                    </label>
                    <button className="btn btn-primary fullWidth" title="save"
                            disabled={expectedDailyTimelogInMinutes.loadingState !== "DONE" || !JiraTimeService.isValidJiraFormat(expectedDailyTimelogInMinutes.value)}
                            type={"submit"}><i className="fa fa-save"/> save
                    </button>
                </div>
            </form>
        </div>
    </div>
}
