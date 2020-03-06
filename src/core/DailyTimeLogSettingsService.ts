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
        const settings = await this.getExpectedDailyTimelogSettings();

        let isWeekdayExpected = this.isExpectedWeekday(day, settings);

        return isWeekdayExpected ?
            settings.expectedDailyTimeToLogInMinutes :
            0;
    }

    public static isExpectedWeekday(day: Date, settings: DailyTimelogSettings): boolean {
        const {monday, friday, thursday, wednesday, tuesday, sunday, saturday} = settings.expectedTimelogDays;
        switch (day.getDay()) {
            case 1:
                return monday;
            case 2:
                return tuesday;
            case 3:
                return wednesday;
            case 4:
                return thursday;
            case 5:
                return friday;
            case 6:
                return saturday;
            default:
                return sunday;
        }
    }
}
