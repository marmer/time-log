import SettingsRepository from "./SettingsRepository";
import Lockr from "lockr";

describe("SettingsRepository", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    describe("getExpectedDailyTimelogInMinutes", () => {
        it("should return null if no settings has been stored yet", async () => {
            expect(SettingsRepository.getExpectedDailyTimelogInMinutes()).toBeNull();
        });

        it("should return null if settings have been stored yet but not this one", async () => {
            Lockr.set("timlogSettings", {});
            expect(SettingsRepository.getExpectedDailyTimelogInMinutes()).toBeNull();
        });
        it("should return the stored expected daily timelog in minutes if it exists", async () => {
            Lockr.set("timelogSettings", {expectedDailyTimelogInMinutes: 42});
            expect(SettingsRepository.getExpectedDailyTimelogInMinutes()).toBe(42);
        });
    });

    describe("setExpectedDailyTimelogInMinutes", () => {
        it("should store the value with new settings if they don't exist", async () => {
            SettingsRepository.setExpectedDailyTimelogInMinutes(42);

            expect(Lockr.get("timelogSettings")).toHaveProperty("expectedDailyTimelogInMinutes", 42)
        });

        it("should update an existing value without to change different properties", async () => {
            Lockr.set("timelogSettings", {expectedDailyTimelogInMinutes: 123, differentProp: "someValue"});
            SettingsRepository.setExpectedDailyTimelogInMinutes(42);

            expect(Lockr.get("timelogSettings")).toHaveProperty("expectedDailyTimelogInMinutes", 42);
            expect(Lockr.get("timelogSettings")).toHaveProperty("differentProp", "someValue")
        });
    });
});
