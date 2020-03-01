import SettingsRepository from "../local/SettingsRepository";


export interface DailyTimelogSettings {
    expectedDailyTimelogInMinutes: number,
    expectedTimelogDays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
}

export default class DailyTimeLogSettingsService {
    static async setExpectedDailyTimelogSettings(dailyTimelogSettings: DailyTimelogSettings): Promise<void> {
        // TODO: marmer 01.03.2020 implement vor active days and other properties as well
        await this.setExpectedDailyTimelogInMinutes(dailyTimelogSettings.expectedDailyTimelogInMinutes)
    }

    static async getExpectedDailyTimelogSettings(): Promise<DailyTimelogSettings> {
        // TODO: marmer 01.03.2020 implement vor active days and other properties as well
        return {
            expectedDailyTimelogInMinutes: await this.getExpectedDailyTimelogInMinutes(),
            expectedTimelogDays: [false, true, true, true, true, true, false]
        }
    }

    static async setExpectedDailyTimelogInMinutes(value: number): Promise<void> {
        SettingsRepository.setExpectedDailyTimelogInMinutes(value)
    }

    static async getExpectedDailyTimelogInMinutes(): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = await SettingsRepository.getExpectedDailyTimelogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }
}
