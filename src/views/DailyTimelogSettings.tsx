import React, {useEffect, useState} from "react";
import SettingsService from "../core/SettingsService";
import JiraTimeService from "../core/JiraTimeService";

export default function DailyTimelogSettings() {
    const loadingPlaceholder = "Loading...";

    const [expectedDailyTimelogInMinutes, setExpectedDailyTimelogInMinutes] = useState<{
        value: string,
        isLoading: boolean
    }>({value: loadingPlaceholder, isLoading: true});

    useEffect(() => {
        setExpectedDailyTimelogInMinutes({
            isLoading: true,
            value: loadingPlaceholder
        });
        SettingsService.getExpectedDailyTimelogInMinutes()
            .then(minutes => {
                setExpectedDailyTimelogInMinutes({
                    isLoading: false,
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
                SettingsService.setExpectedDailyTimelogInMinutes(JiraTimeService.jiraFormatToMinutes(expectedDailyTimelogInMinutes.value));
                return false;
            }}>
                <label>Expected Time to log per day <input id="expectedTimeToLog" type="text"
                                                           className={(JiraTimeService.isValidJiraFormat(expectedDailyTimelogInMinutes.value) ? "" : " invalid-format")}
                                                           disabled={expectedDailyTimelogInMinutes.isLoading}
                                                           value={expectedDailyTimelogInMinutes.value}
                                                           onChange={({target}) => setExpectedDailyTimelogInMinutes({
                                                               ...expectedDailyTimelogInMinutes, value: target.value
                                                           })}
                                                           placeholder="e.g. 7h 30m"/>
                </label>
                <button className="btn btn-primary fullWidth" title="save"
                        disabled={!JiraTimeService.isValidJiraFormat(expectedDailyTimelogInMinutes.value)}
                        type={"submit"}><i className="fa fa-save"/> save
                </button>
            </form>
        </div>
    </div>
}
