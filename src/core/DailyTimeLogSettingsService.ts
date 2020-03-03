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
        // TODO: marmer 01.03.2020 implement vor active days and other properties as well
        await this.setExpectedDailyTimelogInMinutes(dailyTimelogSettings.expectedDailyTimelogInMinutes)
    }

    static async getExpectedDailyTimelogSettings(): Promise<DailyTimelogSettings> {
        // TODO: marmer 01.03.2020 implement vor active days and other properties as well
        return {
            expectedDailyTimelogInMinutes: await this.getExpectedDailyTimelogInMinutes(),
            expectedTimelogDays: {
                sunday: false,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: false
            }
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
