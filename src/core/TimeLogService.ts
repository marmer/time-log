import TimeLogRepository from "../local/TimeLogRepository";
import DailyTimeLogSettingsService from "./DailyTimeLogSettingsService";
import moment from "moment";

export interface TimeLog {
    durationInMinutes: number;
    description: string;
}

export default class TimeLogService {
    public static async saveTimeLogsForDay(date: Date, timeLogs: TimeLog[]): Promise<TimeLog[]> {
        return TimeLogRepository.saveTimelogs(date, timeLogs);
    }

    public static async getTimeLogsForDay(date: Date): Promise<TimeLog[]> {
        return TimeLogRepository.getTimeLogsForDay(date);
    }


    public static async getExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive(dayExclusive: Date): Promise<number> {
        if (dayExclusive.getDate() === 1) return 0;

        const firstOfMonth = moment(dayExclusive).set("date", 1);
        const endDay = moment(dayExclusive).subtract(1, "day");
        const numberOfDaysToTakeIntoAccount = endDay.diff(firstOfMonth, "day") + 1;
        const sumOfExpectedWorkToLog = await DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutes();
        const loggedTimeSum: number = await TimeLogRepository.getSumOfTimeLoggedBetween(firstOfMonth.toDate(), endDay.toDate());
        return sumOfExpectedWorkToLog * numberOfDaysToTakeIntoAccount - loggedTimeSum;
    }
}
