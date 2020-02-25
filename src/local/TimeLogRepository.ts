import {TimeLog} from "../core/TimeLogService";
import TimeLogDatabase from "./TimeLogDatabase";

export default class TimeLogRepository {
    private static readonly db = new TimeLogDatabase();

    public static async saveTimelogs(day: Date, timelogs: TimeLog[]): Promise<TimeLog[]> {
        return TimeLogRepository.db.timelogDay.put({
            day,
            timelogs
        }).then(() => timelogs);
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        const timelogDay = await TimeLogRepository.db.timelogDay.get(date);
        return timelogDay ? timelogDay.timelogs : [];
    }
}
