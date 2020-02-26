import SettingsRepository from "./SettingsRepository";
import TimeLogDatabase from "./TimeLogDatabase";
import moment from "moment";


describe("SettingsRepository", () => {
    const initialKey = moment(new Date(0)).format("YYYY-MM-DD");
    const db: TimeLogDatabase = new TimeLogDatabase();

    beforeEach(async () => {
        await db.clearAllTables();
    });

    describe("getExpectedDailyTimelogInMinutes", () => {
        it("should return null if no settings has been stored yet", async () => {
            expect(await SettingsRepository.getExpectedDailyTimelogInMinutes()).toBeNull();
        });

        it("should return null if settings have been stored yet but not this one", async () => {
            await db.timlogExpectationSettings.put({
                validFrom: initialKey,
            });
            expect(await SettingsRepository.getExpectedDailyTimelogInMinutes()).toBeNull();
        });
        it("should return the stored expected daily timelog in minutes if it exists", async () => {
            await db.timlogExpectationSettings.put({
                validFrom: initialKey,
                expectedDailyTimelogsInMinutes: 42
            });

            expect(await SettingsRepository.getExpectedDailyTimelogInMinutes()).toBe(42);
        });
    });

    describe("setExpectedDailyTimelogInMinutes", () => {
        it("should store the value with new settings if they don't exist yet", async () => {
            await SettingsRepository.setExpectedDailyTimelogInMinutes(42);

            const settings = await db.timlogExpectationSettings.get(initialKey);
            expect(settings).toHaveProperty("expectedDailyTimelogsInMinutes", 42)
        });

        it("should update an existing value without to change different properties", async () => {
            await db.timlogExpectationSettings.put({
                validFrom: initialKey,
                expectedDailyTimelogsInMinutes: 123,
                differentProp: "someValue"
            } as any);
            await SettingsRepository.setExpectedDailyTimelogInMinutes(42);

            expect(await db.timlogExpectationSettings.get(initialKey)).toHaveProperty("expectedDailyTimelogsInMinutes", 42);
            expect(await db.timlogExpectationSettings.get(initialKey)).toHaveProperty("differentProp", "someValue");
        });
    });
});
