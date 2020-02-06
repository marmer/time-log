import {TimeLog} from "../core/TimeLogService";
import Lockr from "lockr";
import moment from "moment";

interface TimeLogDbo {
    [day: string]: TimeLog[]
}

export default class TimeLogRepository {
    public static getTimeLogsForDay(date: Date): TimeLog[] {

        const timeLog: TimeLogDbo = Lockr.get("TimeLog", {});

        const key = this.timelogKeyFor(date);
        const timelogs = timeLog[key];
        return timelogs ? timelogs : [];
    }

    private static timelogKeyFor(date: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}
