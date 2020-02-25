import TimeLogRepository from "../local/TimeLogRepository";
import SettingsService from "./SettingsService";
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


    public static async getExpectedTimeToLogDeltaInMonthInMinutesUntil(dayInclusive: Date): Promise<number> {
        const firstOfMonth = moment(dayInclusive).set("date", 1);
        const numberOfDaysToTakeIntoAccount = moment(dayInclusive).diff(firstOfMonth, "day") + 1;
        const sumOfExpectedWorkToLog = await SettingsService.getExpectedDailyTimelogInMinutes();
        const loggedTimeSum: number = await TimeLogRepository.getSumOfTimeLoggedBetween(firstOfMonth.toDate(), dayInclusive);
        return sumOfExpectedWorkToLog * numberOfDaysToTakeIntoAccount - loggedTimeSum;
    }
}
