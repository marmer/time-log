import {TimeLog} from "../core/TimeLogService";
import moment from "moment";
import TimeLogDatabase from "./TimeLogDatabase";

interface TimeLogDbo {
    [day: string]: TimeLog[]
}

export default class TimeLogRepository {
    private static readonly STORE_KEY = "TimeLog";

    private static readonly db = new TimeLogDatabase();

    public static async saveTimelogs(date: Date, timeLogs: TimeLog[]): Promise<TimeLog[]> {
        return Promise.resolve([]);
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        const timelogDay = await TimeLogRepository.db.timelogDay.get(date);
        return timelogDay?.timelogs!;
    }

    private static getTimelogKeyForMonthOf(date: Date) {
        return TimeLogRepository.STORE_KEY + moment(date).format("-YYYY-MM");
    }

    private static timelogKeyFor(date: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}
