import SettingsService from "./SettingsService";
import SettingsRepository from "../local/SettingsRepository";

describe("SettingsService", () => {
    it("should resolve with a default value of 8 hours if nothing is stored in the repository yet", async () => {
        SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockReturnValue(null);

        const anyDate = new Date();

        return expect(SettingsService.getExpectedDailyTimelogInMinutes(anyDate)).resolves.toBe(480);
    });

    it("should return the value of the repository if it serves a value", async () => {
        SettingsRepository.getExpectedDailyTimelogInMinutes = jest.fn().mockReturnValue(42);

        const anyDate = new Date();

        return expect(SettingsService.getExpectedDailyTimelogInMinutes(anyDate)).resolves.toBe(42);
    });
});
