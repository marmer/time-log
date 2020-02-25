import {TimeLog} from "../core/TimeLogService";
import TimeLogDatabase from "./TimeLogDatabase";
import moment from "moment";

export default class TimeLogRepository {
    private static readonly db = new TimeLogDatabase();

    public static async saveTimelogs(day: Date, timelogs: TimeLog[]): Promise<TimeLog[]> {
        return TimeLogRepository.db.timelogDay.put({
            day: TimeLogRepository.toKey(day),
            timelogs
        }).then(() => timelogs);
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        const timelogDay = await TimeLogRepository.db.timelogDay.get(TimeLogRepository.toKey(date));
        return timelogDay ? timelogDay.timelogs : [];
    }

    static getSumOfTimeLoggedBetween(startInclusive: Date, endInclusive: Date): number {
        return 0;
    }

    private static toKey(day: Date): string {
        return moment(day).format("YYYY-MM-DD");
    }
}
