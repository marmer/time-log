import Dexie from "dexie";
import {TimeLog} from "../core/TimeLogService";

export default class TimeLogDatabase extends Dexie {
    timelogDay: Dexie.Table<TimelogDayDbo, string>;
    timlogExpectationSettings: Dexie.Table<TimlogExpectationSettingsDbo, string>;

    constructor() {
        super("TimeLogDatabase");
        this.version(1).stores({
            timelogDay: 'day, timelogs.durationInMinutes',
            timlogExpectationSettings: 'validFrom',
        });
        this.timelogDay = this.table("timelogDay");
        this.timlogExpectationSettings = this.table("timlogExpectationSettings");
    }

    public async clearAllTables() {
        return Promise.all([
            this.timelogDay.clear(),
            this.timlogExpectationSettings.clear()
        ]);
    }
}

export interface TimelogDayDbo {
    day: string;
    timelogs: TimeLog[];
}

export interface TimlogExpectationSettingsDbo {
    validFrom: string,
    expectedDailyTimeToLogInMinutes: number,
    expectedTimelogDays: {
        sunday: boolean,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean
    }
}
