import {TimeLog} from "../core/TimeLogService";
import Lockr from "lockr";
import moment from "moment";

interface TimeLogDbo {
    [day: string]: TimeLog[]
}

export default class TimeLogRepository {
    private static readonly STORE_KEY = "TimeLog";

    public static saveTimelogs(date: Date, timeLogs: TimeLog[]): TimeLog[] {
        const dbo: TimeLogDbo = {};
        dbo[TimeLogRepository.timelogKeyFor(date)] = timeLogs;
        Lockr.set(TimeLogRepository.STORE_KEY, dbo);
        return timeLogs;
    }

    public static getTimeLogsForDay(date: Date): TimeLog[] {

        const timeLog: TimeLogDbo = Lockr.get(this.STORE_KEY, {});

        const key = this.timelogKeyFor(date);
        const timelogs = timeLog[key];
        return timelogs ? timelogs : [];
    }

    private static timelogKeyFor(date: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}
