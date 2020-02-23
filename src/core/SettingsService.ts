import SettingsRepository from "../local/SettingsRepository";

export default class SettingsService {
    static async setExpectedDailyTimelogInMinutes(value: number): Promise<void> {
        // TODO: marmer 23.02.2020 implement me
        return Promise.reject(new Error("Not implemented yet"));
    }

    static async getExpectedDailyTimelogInMinutes(): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = SettingsRepository.getExpectedDailyTimelogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }

}
