import Lockr from "lockr";

interface TimelogSettings {
    expectedDailyTimelogInMinutes?: number;
}

export default class SettingsRepository {
    private static readonly emptySettings: TimelogSettings = {};

    private static readonly settingsObjectKey = "timelogSettings";

    static getExpectedDailyTimelogInMinutes(): number | null {
        const {expectedDailyTimelogInMinutes} = Lockr.get(SettingsRepository.settingsObjectKey, SettingsRepository.emptySettings);
        return expectedDailyTimelogInMinutes ? expectedDailyTimelogInMinutes : null;
    }

}
