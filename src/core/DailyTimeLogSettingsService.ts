import SettingsRepository from "../local/SettingsRepository";


export interface DailyTimelogSettings {
    expectedDailyTimelogInMinutes: number,
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
            expectedDailyTimelogInMinutes: eightHours,
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

    static async setExpectedDailyTimelogInMinutes(value: number): Promise<void> {
        SettingsRepository.setExpectedDailyTimelogInMinutes(value)
    }

    static async getExpectedDailyTimelogInMinutes(): Promise<number> {
        const eightHours = 480;
        const configuredHoursToWorkPerDay = await SettingsRepository.getExpectedDailyTimelogInMinutes();
        return Promise.resolve(configuredHoursToWorkPerDay ? configuredHoursToWorkPerDay : eightHours);
    }
}
