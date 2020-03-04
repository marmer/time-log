import SettingsRepository from "./SettingsRepository";
import TimeLogDatabase from "./TimeLogDatabase";
import moment from "moment";
import {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";


describe("SettingsRepository", () => {
    const db: TimeLogDatabase = new TimeLogDatabase();
    const initialKey = moment(new Date(0)).format("YYYY-MM-DD");
    const timelogExpectationSettingsDboBase = {
        validFrom: initialKey,
        expectedDailyTimeToLogInMinutes: 42,
        expectedTimelogDays: {
            wednesday: true,
            tuesday: false,
            thursday: true,
            sunday: false,
            saturday: true,
            monday: false,
            friday: true
        }
    };

    beforeEach(async () => {
        await db.clearAllTables();
    });

    describe("getExpectedDailyTimeToLogInMinutes", () => {
        it("should return null if no settings has been stored yet", async () => {
            expect(await SettingsRepository.getExpectedDailyTimeToLogInMinutes()).toBeNull();
        });

        it("should return the stored expected daily timelog in minutes if it exists", async () => {
            await db.timlogExpectationSettings.put({
                ...timelogExpectationSettingsDboBase,
                validFrom: initialKey,
                expectedDailyTimeToLogInMinutes: 42,
            });

            expect(await SettingsRepository.getExpectedDailyTimeToLogInMinutes()).toBe(42);
        });
    });

    describe("getExpectedDailyTimelogSettings", () => {
        it("should return null if no expected daily timelog settings exist yet", async () => {
            const result = await SettingsRepository.getExpectedDailyTimelogSettings();
            expect(result).toBeNull();
        });

        it("should serve stored settings", async () => {
            db.timlogExpectationSettings.put({
                validFrom: initialKey,
                expectedDailyTimeToLogInMinutes: 123,
                expectedTimelogDays: {
                    monday: false,
                    tuesday: false,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                    sunday: false,
                }
            });

            const result = await SettingsRepository.getExpectedDailyTimelogSettings();
            expect(result).toStrictEqual({
                expectedDailyTimeToLogInMinutes: 123,
                expectedTimelogDays: {
                    monday: false,
                    tuesday: false,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                    sunday: false,
                }
            } as DailyTimelogSettings)
        });
    });
});
