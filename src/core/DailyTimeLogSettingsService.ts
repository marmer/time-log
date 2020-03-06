import SettingsRepository from "../local/SettingsRepository";


export interface DailyTimelogSettings {
    expectedDailyTimeToLogInMinutes: number,
    expectedTimelogDays: {
        sunday: boolean,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean
    }
}

export default class DailyTimeLogSettingsService {
    static async setExpectedDailyTimelogSettings(dailyTimelogSettings: DailyTimelogSettings): Promise<void> {
        await SettingsRepository.setExpectedDailyTimelogSettings(dailyTimelogSettings);
    }

    static async getExpectedDailyTimelogSettings(): Promise<DailyTimelogSettings> {
        const settings = await SettingsRepository.getExpectedDailyTimelogSettings();
        const eightHours = 480;
        return settings ? settings : {
            expectedDailyTimeToLogInMinutes: eightHours,
            expectedTimelogDays: {
                sunday: false,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: false
            }
        };
    }

    static async getExpectedDailyTimeToLogInMinutesFor(day: Date): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = await SettingsRepository.getExpectedDailyTimeToLogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }
}
