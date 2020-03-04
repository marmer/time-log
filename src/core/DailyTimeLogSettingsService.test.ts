import DailyTimeLogSettingsService, {DailyTimelogSettings} from "./DailyTimeLogSettingsService";
import SettingsRepository from "../local/SettingsRepository";

describe("DailyTimeLogSettingsService", () => {
    beforeEach(() => {
        jest.unmock("../local/SettingsRepository");
        jest.resetAllMocks();
    });

    describe("getExpectedDailyTimelogInMinutes", () => {

        it("should resolve with a default value of 8 hours if nothing is stored in the repository yet", async () => {
            SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(null);

            return expect(DailyTimeLogSettingsService.getExpectedDailyTimelogInMinutes()).resolves.toBe(480);
        });

        it("should return the value of the repository if it serves a value", async () => {
            SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(42);

            return expect(DailyTimeLogSettingsService.getExpectedDailyTimelogInMinutes()).resolves.toBe(42);
        });
    });
    describe("setExpectedDailyTimelogInMinutes", () => {
        it("should save the given value", async () => {
            SettingsRepository.setExpectedDailyTimelogInMinutes = jest.fn();

            const result = await DailyTimeLogSettingsService.setExpectedDailyTimelogInMinutes(42);
            expect(result).toBe(undefined);
            expect(SettingsRepository.setExpectedDailyTimelogInMinutes).toBeCalledWith(42);
        });
    });

    describe("getExpectedDailyTimelogSettings", () => {
        it("should serve default values if no settings exist yet", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(null);

            const result = await DailyTimeLogSettingsService.getExpectedDailyTimelogSettings();

            expect(result).toStrictEqual({
                expectedDailyTimelogInMinutes: 480,
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
                expectedDailyTimelogInMinutes: 480,
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

            expect(result).toStrictEqual({
                expectedDailyTimelogInMinutes: 480,
                expectedTimelogDays: {
                    sunday: false,
                    monday: true,
                    tuesday: false,
                    wednesday: true,
                    thursday: false,
                    friday: true,
                    saturday: false,
                }
            } as DailyTimelogSettings)
        });
    });
});
