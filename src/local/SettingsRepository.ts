import TimeLogDatabase, {TimlogExpectationSettings} from "./TimeLogDatabase";
import moment from "moment";
import {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";


const {timlogExpectationSettings} = new TimeLogDatabase();

const initialKey = moment(new Date(0)).format("YYYY-MM-DD");
export default class SettingsRepository {
    static async getExpectedDailyTimelogInMinutes(): Promise<number | null> {
        const settings = await timlogExpectationSettings.get(initialKey);

        return !settings || !settings.expectedDailyTimelogsInMinutes ?
            null :
            settings.expectedDailyTimelogsInMinutes;
    }

    static async setExpectedDailyTimelogInMinutes(expectedDailyTimelogsInMinutes: number) {
        await this.prepareSettings();

        return timlogExpectationSettings.update(initialKey, {
            validFrom: initialKey,
            expectedDailyTimelogsInMinutes
        } as TimlogExpectationSettings)
    }

    static async getExpectedDailyTimelogSettings(): Promise<DailyTimelogSettings | null> {
        // TODO: marmer 04.03.2020 implement me
        return null;
    }

    static async setExpectedDailyTimelogSettings(dailyTimelogSettings: DailyTimelogSettings) {
        return null;
    }

    private static async prepareSettings() {
        if (!(await timlogExpectationSettings.get(initialKey))) {
            await timlogExpectationSettings.put({
                validFrom: initialKey
            })
        }
    }
}
