import {TimeLogDatabase} from "../local/TimeLogDatabase";

export interface TimeLog {
    day: Date;
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {
    private static readonly db = new TimeLogDatabase();

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        return TimeLogService.db.timeLogs.where("date").equals(date).toArray();
    }

}
