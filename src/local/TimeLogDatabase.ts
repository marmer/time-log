import Dexie from "dexie";
import {TimeLog} from "../core/TimeLogService";

export default class TimeLogDatabase extends Dexie {
    timelogDay: Dexie.Table<TimelogDayDbo, Date>;

    constructor() {
        super("TimeLogDatabase");
        this.version(1).stores({
            timelogDay: 'day, timelogs.durationInMinutes',
        });
        this.timelogDay = this.table("timelogDay");
    }

    public clearAllTables() {
        this.timelogDay.clear();
    }
}

export interface TimelogDayDbo {
    day: Date;
    timelogs: TimeLog[];
}
