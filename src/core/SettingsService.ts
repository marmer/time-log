import SettingsRepository from "../local/SettingsRepository";

export default class SettingsService {
    static async getExpectedDailyTimelogInMinutes(): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = SettingsRepository.getExpectedDailyTimelogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }

}
