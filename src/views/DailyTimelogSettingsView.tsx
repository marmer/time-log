import React, {useEffect, useState} from "react";
import DailyTimeLogSettingsService, {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";
import JiraTimeService from "../core/JiraTimeService";
import {AsyncValueType} from "./AsyncValueType";

enum WeekDays {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}


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

    function flip(weekDay: WeekDays) {
        if (dailyTimelogSettingsInputs.loadingState === "DONE") {
            setDailyTimelogSettingsInputs({
                ...dailyTimelogSettingsInputs,
                value: {
                    ...(dailyTimelogSettingsInputs as any).value,
                    expectedTimelogDays: dailyTimelogSettingsInputs.value.expectedTimelogDays.map((value, index) => index === weekDay ? !value : value)
                }
            })
        }
    }

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
                            sunday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.SUNDAY],
                            monday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.MONDAY],
                            tuesday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.TUESDAY],
                            wednesday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.WEDNESDAY],
                            thursday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.THURSDAY],
                            friday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.FRIDAY],
                            saturday: dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.SATURDAY]
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
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={
                                   dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.MONDAY]
                               }
                               onChange={(_) => {
                                   flip(WeekDays.MONDAY);
                               }}/> Monday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.TUESDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.TUESDAY);
                               }}
                        /> Tuesday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.WEDNESDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.WEDNESDAY);
                               }}
                        /> Wednesday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.THURSDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.THURSDAY);
                               }}
                        /> Thursday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.FRIDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.FRIDAY);
                               }}
                        /> Friday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.SATURDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.SATURDAY);
                               }}
                        /> Saturday
                    </label>
                    <label>
                        <input type="checkbox"
                               disabled={dailyTimelogSettingsInputs.loadingState !== "DONE"}
                               checked={dailyTimelogSettingsInputs.loadingState === "DONE" && dailyTimelogSettingsInputs.value.expectedTimelogDays[WeekDays.SUNDAY]}
                               onChange={(_) => {
                                   flip(WeekDays.SUNDAY);
                               }}
                        /> Sunday
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
