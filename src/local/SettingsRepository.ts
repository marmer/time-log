import TimeLogDatabase from "./TimeLogDatabase";
import moment from "moment";
import {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";


const {timlogExpectationSettings} = new TimeLogDatabase();

const initialKey = moment(new Date(0)).format("YYYY-MM-DD");
export default class SettingsRepository {
    static async getExpectedDailyTimeToLogInMinutes(): Promise<number | null> {
        const settings = await timlogExpectationSettings.get(initialKey);

        return settings ? settings.expectedDailyTimeToLogInMinutes : null;
    }

    static async getExpectedDailyTimelogSettings(): Promise<DailyTimelogSettings | null> {
        const dbo = await timlogExpectationSettings.get(initialKey);
        return !dbo ?
            null :
            {
                expectedTimelogDays: dbo.expectedTimelogDays,
                expectedDailyTimeToLogInMinutes: dbo.expectedDailyTimeToLogInMinutes
            };
    }

    static async setExpectedDailyTimelogSettings({expectedDailyTimeToLogInMinutes, expectedTimelogDays}: DailyTimelogSettings) {
        await timlogExpectationSettings.put({
            validFrom: initialKey,
            expectedDailyTimeToLogInMinutes,
            expectedTimelogDays: {...expectedTimelogDays}
        });
    }
}
