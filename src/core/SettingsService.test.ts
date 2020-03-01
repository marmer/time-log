import DailyTimeLogSettingsService from "./DailyTimeLogSettingsService";
import SettingsRepository from "../local/SettingsRepository";

describe("DailyTimeLogSettingsService", () => {
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
});
