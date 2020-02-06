import Dexie from "dexie";
import {TimeLog} from "../core/TimeLogService";

export class TimeLogDatabase extends Dexie {
    timeLogs: Dexie.Table<TimeLog, number>;

    constructor() {
        super("TimeLogDatabase");
        this.version(1).stores({
            timeLogs: '++,day',
        });
        this.timeLogs = this.table("timeLogs");
    }
}
