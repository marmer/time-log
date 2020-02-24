import SettingsRepository from "../local/SettingsRepository";

export default class SettingsService {
    static async setExpectedDailyTimelogInMinutes(value: number): Promise<void> {
        SettingsRepository.setExpectedDailyTimelogInMinutes(value)
    }

    static async getExpectedDailyTimelogInMinutes(): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = SettingsRepository.getExpectedDailyTimelogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }

    static async getExpectedTimeToLogDeltaInMonthInMinutesUntill(dayInclusive: Date) {
// TODO: marmer 24.02.2020 implement me!
    }
}
