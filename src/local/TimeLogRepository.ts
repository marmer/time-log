import {TimeLog} from "../core/TimeLogService";
import Lockr from "lockr";
import moment from "moment";

interface TimeLogDbo {
    [day: string]: TimeLog[]
}

export default class TimeLogRepository {
    private static readonly STORE_KEY = "TimeLog";

    // private static readonly STORE_KEY = "TimeLogs-2018-02";

    public static saveTimelogs(date: Date, timeLogs: TimeLog[]): TimeLog[] {
        const dbo: TimeLogDbo = Lockr.get(this.getTimelogKeyForMonthOf(date), {});
        dbo[TimeLogRepository.timelogKeyFor(date)] = timeLogs;
        Lockr.set(this.getTimelogKeyForMonthOf(date), dbo);
        return timeLogs;
    }

    public static getTimeLogsForDay(date: Date): TimeLog[] {

        const timeLog: TimeLogDbo = Lockr.get(this.getTimelogKeyForMonthOf(date), {});

        const key = this.timelogKeyFor(date);
        const timelogs = timeLog[key];
        return timelogs ? timelogs : [];
    }

    private static getTimelogKeyForMonthOf(date: Date) {
        return TimeLogRepository.STORE_KEY + moment(date).format("-YYYY-MM");
    }

    private static timelogKeyFor(date: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}
