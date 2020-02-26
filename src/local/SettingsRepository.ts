import TimeLogDatabase, {TimlogExpectationSettings} from "./TimeLogDatabase";
import moment from "moment";


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
        timlogExpectationSettings.update(initialKey, {
            validFrom: initialKey,
            expectedDailyTimelogsInMinutes
        } as TimlogExpectationSettings)
    }
}
