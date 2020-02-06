import TimeLogRepository from "../local/TimeLogRepository";

export interface TimeLog {
    day: Date;
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        return Promise.resolve(TimeLogRepository.getTimeLogsForDay(date));
    }

}
