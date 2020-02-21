export default class SettingsService {
    static async getExpectedDailyTimelogInMinutesFor(day: Date): Promise<number> {
        // TODO: marmer 21.02.2020 replace this dummy value by something real!
        return Promise.resolve(450);
    }

}
