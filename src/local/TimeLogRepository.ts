import {TimeLog} from "../core/TimeLogService";

export default class TimeLogRepository {
    public static getTimeLogsForDay(date: Date): TimeLog[] {
        return [{day: new Date(), durationInMinutes: 42, description: "foo"}];
    }
}
