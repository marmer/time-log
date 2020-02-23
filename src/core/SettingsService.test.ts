import SettingsService from "./SettingsService";
import SettingsRepository from "../local/SettingsRepository";

describe("SettingsService", () => {
    it("should resolve with a default value of 8 hours if nothing is stored in the repository yet", async () => {
        SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockReturnValue(null);

        return expect(SettingsService.getExpectedDailyTimelogInMinutes()).resolves.toBe(480);
    });

    it("should return the value of the repository if it serves a value", async () => {
        SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockReturnValue(42);

        return expect(SettingsService.getExpectedDailyTimelogInMinutes()).resolves.toBe(42);
    });
});
