import TimeLogRepository from "../local/TimeLogRepository";
import DailyTimeLogSettingsService, {DailyTimelogSettings} from "./DailyTimeLogSettingsService";
import moment, {Moment} from "moment";

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
        const settings = await DailyTimeLogSettingsService.getExpectedDailyTimelogSettings();
        const numberOfDaysToTakeIntoAccount = TimeLogService.getDateRangeInclusive(firstOfMonth, endDay)
            .filter(day => this.isExpectedDay(day, settings)).length;
        const loggedTimeSum: number = await TimeLogRepository.getSumOfTimeLoggedBetween(firstOfMonth.toDate(), endDay.toDate());
        return settings.expectedDailyTimeToLogInMinutes * numberOfDaysToTakeIntoAccount - loggedTimeSum;
    }

    private static isExpectedDay(day: moment.Moment, settings: DailyTimelogSettings) {
        return DailyTimeLogSettingsService.isExpectedWeekday(day.toDate(), settings);
    }

    private static getDateRangeInclusive(startInclusive: Moment, endInclusive: Moment): Moment[] {
        const range: Moment[] = [];
        let current: Moment = startInclusive;
        while (!current.isAfter(endInclusive)) {
            range.push(current);
            current = current.clone().add(1, "day");
        }
        return range;
    }
}
