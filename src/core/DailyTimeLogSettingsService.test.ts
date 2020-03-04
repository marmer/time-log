import DailyTimeLogSettingsService, {DailyTimelogSettings} from "./DailyTimeLogSettingsService";
import SettingsRepository from "../local/SettingsRepository";

const dailyTimeLogSettingsBase = {
    expectedDailyTimeToLogInMinutes: 480,
    expectedTimelogDays: {
        sunday: false,
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
    }
} as DailyTimelogSettings;

describe("DailyTimeLogSettingsService", () => {
    beforeEach(() => {
        jest.unmock("../local/SettingsRepository");
        jest.resetAllMocks();
    });

    describe("getExpectedDailyTimeToLogInMinutes", () => {

        it("should resolve with a default value of 8 hours if nothing is stored in the repository yet", async () => {
            SettingsRepository.getExpectedDailyTimeToLogInMinutes = jest.fn().mockResolvedValue(null);

            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutes()).resolves.toBe(480);
        });

        it("should return the value of the repository if it serves a value", async () => {
            SettingsRepository.getExpectedDailyTimeToLogInMinutes = jest.fn().mockResolvedValue(42);

            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutes()).resolves.toBe(42);
        });
    });

    describe("getExpectedDailyTimelogSettings", () => {
        it("should serve default values if no settings exist yet", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(null);

            const result = await DailyTimeLogSettingsService.getExpectedDailyTimelogSettings();

            expect(result).toStrictEqual({
                expectedDailyTimeToLogInMinutes: 480,
                expectedTimelogDays: {
                    sunday: false,
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: false,
                }
            } as DailyTimelogSettings)
        });

        it("should serve received settings", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue({
                expectedDailyTimeToLogInMinutes: 480,
                expectedTimelogDays: {
                    sunday: false,
                    monday: true,
                    tuesday: false,
                    wednesday: true,
                    thursday: false,
                    friday: true,
                    saturday: false,
                }
            } as DailyTimelogSettings);

            const result = await DailyTimeLogSettingsService.getExpectedDailyTimelogSettings();

            expect(result).toStrictEqual({...dailyTimeLogSettingsBase})
        });

        describe("setExpectedDailyTimelogSettings", () => {
            it("should store the given settings and resolve after", async () => {
                SettingsRepository.setExpectedDailyTimelogSettings = jest.fn();

                await DailyTimeLogSettingsService.setExpectedDailyTimelogSettings({
                    ...dailyTimeLogSettingsBase
                });

                expect(SettingsRepository.setExpectedDailyTimelogSettings).toBeCalledWith({...dailyTimeLogSettingsBase});
            });
        });
    });
});
