import React, {useEffect, useState} from "react";
import SettingsService from "../core/SettingsService";
import JiraTimeService from "../core/JiraTimeService";

const loadingPlaceholder = "Loading...";
export default () => {
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
            <form onSubmit={_ => false}>
                <label htmlFor="expectedTimeToLog">Expected Time to log per day</label>
                <input id="expectedTimeToLog" type="text" className="form-control"
                       disabled={expectedDailyTimelogInMinutes.isLoading}
                       value={expectedDailyTimelogInMinutes.value}
                       onChange={({target}) => setExpectedDailyTimelogInMinutes({
                           ...expectedDailyTimelogInMinutes, value: target.value
                       })}
                       placeholder="e.g. 7h 30m"/>
                <button className="btn btn-primary fullWidth" title="save"
                        disabled={!JiraTimeService.isValidJiraFormat(expectedDailyTimelogInMinutes.value)}
                        type={"submit"}
                ><i className="fa fa-save"/> save
                </button>
            </form>
            </div>
        </div>

}