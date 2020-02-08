import TimeLogRepository from "../local/TimeLogRepository";

export interface TimeLog {
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {
    public static async storeTimeLogsForDay(date: Date, timeLogs: TimeLog[]): Promise<TimeLog[]> {
        console.log(timeLogs);
        // TODO: marmer 07.02.2020 Implement me!
        return Promise.resolve(timeLogs);
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        return Promise.resolve(TimeLogRepository.getTimeLogsForDay(date));
    }

}
