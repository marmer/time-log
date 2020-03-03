import React, {useEffect, useState} from "react";
import DailyTimeLogSettingsService, {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";
import JiraTimeService from "../core/JiraTimeService";
import {AsyncValueType} from "./AsyncValueType";

export default function DailyTimelogSettingsView() {
    const loadingPlaceholder = "Loading...";

    const [dailyTimelogSettingsInputs, setDailyTimelogSettingsInputs] = useState<AsyncValueType<{
        expectedDailyTimelog: string,
        expectedTimelogDays: boolean[]
    }>>({
        loadingState: "LOADING",
    });

    useEffect(() => {
        setDailyTimelogSettingsInputs({
            loadingState: "LOADING",
        });
        DailyTimeLogSettingsService.getExpectedDailyTimelogSettings()
            .then((dailyTimelogSettings: DailyTimelogSettings) => {
                setDailyTimelogSettingsInputs({
                    loadingState: "DONE",
                    value: {
                        expectedDailyTimelog: JiraTimeService.minutesToJiraFormat(dailyTimelogSettings.expectedDailyTimelogInMinutes),
                        expectedTimelogDays: [
                            dailyTimelogSettings.expectedTimelogDays.saturday,
                            dailyTimelogSettings.expectedTimelogDays.monday,
                            dailyTimelogSettings.expectedTimelogDays.tuesday,
                            dailyTimelogSettings.expectedTimelogDays.wednesday,
                            dailyTimelogSettings.expectedTimelogDays.thursday,
                            dailyTimelogSettings.expectedTimelogDays.friday,
                            dailyTimelogSettings.expectedTimelogDays.sunday
                        ]
                    }
                });
            })
    }, []);
    return <div className="card">
        <div className="card-header">
            Day Settings
        </div>
        <div className="form-group row card-body">
            <form onSubmit={_ => {
                if (dailyTimelogSettingsInputs.loadingState === "DONE")
                    DailyTimeLogSettingsService.setExpectedDailyTimelogSettings({
                        expectedDailyTimelogInMinutes: JiraTimeService.jiraFormatToMinutes(dailyTimelogSettingsInputs.value.expectedDailyTimelog),
                        expectedTimelogDays: {
                            sunday: dailyTimelogSettingsInputs.value.expectedTimelogDays[0],
                            monday: dailyTimelogSettingsInputs.value.expectedTimelogDays[1],
                            tuesday: dailyTimelogSettingsInputs.value.expectedTimelogDays[2],
                            wednesday: dailyTimelogSettingsInputs.value.expectedTimelogDays[3],
                            thursday: dailyTimelogSettingsInputs.value.expectedTimelogDays[4],
                            friday: dailyTimelogSettingsInputs.value.expectedTimelogDays[5],
                            saturday: dailyTimelogSettingsInputs.value.expectedTimelogDays[6]
                        }
                    });
                return false;
            }}>
                <div className="d-flex flex-column">
                    <label>Expected Time to log per day <input id="expectedTimeToLog" type="text"
                                                               className={(dailyTimelogSettingsInputs.loadingState === "DONE" && JiraTimeService.isValidJiraFormat(dailyTimelogSettingsInputs.value.expectedDailyTimelog) ? "" : " invalid-format")}
                                                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                                                               value={dailyTimelogSettingsInputs.loadingState === "DONE" ? dailyTimelogSettingsInputs.value.expectedDailyTimelog : loadingPlaceholder}
                                                               onChange={({target}) => setDailyTimelogSettingsInputs({
                                                                   ...dailyTimelogSettingsInputs,
                                                                   loadingState: "DONE",
                                                                   value: {
                                                                       ...(dailyTimelogSettingsInputs as any).value,
                                                                       expectedDailyTimelog: target.value
                                                                   }
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
                            disabled={dailyTimelogSettingsInputs.loadingState !== "DONE" || !JiraTimeService.isValidJiraFormat(dailyTimelogSettingsInputs.value.expectedDailyTimelog)}
                            type={"submit"}><i className="fa fa-save"/> save
                    </button>
                </div>
            </form>
        </div>
    </div>
}
