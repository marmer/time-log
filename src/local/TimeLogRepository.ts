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

    static async getSumOfTimeLoggedBetween(startInclusive: Date, endInclusive: Date): Promise<number> {
        return TimeLogRepository.db.timelogDay
            .where("day")
            .between(this.toKey(startInclusive), this.toKey(endInclusive), true, true)
            .toArray()
            .then(dbos =>
                dbos.map(dbo => dbo.timelogs)
                    .reduce((a, b) => [...a, ...b], [])
                    .map(timeLog => timeLog.durationInMinutes)
                    .reduce((a, b) => a + b, 0));
    }

    private static toKey(day: Date): string {
        return moment(day).format("YYYY-MM-DD");
    }
}
