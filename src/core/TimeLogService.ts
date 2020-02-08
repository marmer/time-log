import TimeLogRepository from "../local/TimeLogRepository";

export interface TimeLog {
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {
    public static async saveTimeLogsForDay(date: Date, timeLogs: TimeLog[]): Promise<TimeLog[]> {
        return Promise.resolve(TimeLogRepository.saveTimelogs(date, timeLogs));
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        return Promise.resolve(TimeLogRepository.getTimeLogsForDay(date));
    }

}
