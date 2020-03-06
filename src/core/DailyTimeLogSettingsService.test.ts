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

        it("should resolve with a default value of 8 hours if nothing is stored in the repository yet and the given day is a weekday", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(null);
            const day = new Date(2020, 0, 3);
            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutesFor(day)).resolves.toBe(480);
        });
        it("should resolve with zero hours if nothing is stored in the repository yet and the given day is not a weekday", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(null);
            const day = new Date(2020, 0, 4);
            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutesFor(day)).resolves.toBe(0);
        });

        it("should return the value of the repository if the given day is an expected weekday", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue({
                expectedDailyTimeToLogInMinutes: 42,
                expectedTimelogDays: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: true,
                    friday: false,
                    saturday: false,
                    sunday: false,
                }
            } as DailyTimelogSettings);
            const day = new Date(2020, 0, 2);
            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutesFor(day)).resolves.toBe(42);
        });

        it("should return zero if the given day is not an expected day of week", async () => {
            SettingsRepository.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue({
                expectedDailyTimeToLogInMinutes: 42,
                expectedTimelogDays: {
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: false,
                    friday: true,
                    saturday: true,
                    sunday: true,
                }
            } as DailyTimelogSettings);
            const day = new Date(2020, 0, 2);
            return expect(DailyTimeLogSettingsService.getExpectedDailyTimeToLogInMinutesFor(day)).resolves.toBe(0);
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

    describe("isExpectedWeekday", () => {

        [{
            day: new Date(2020, 2, 9),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                monday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 9),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                monday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 10),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                tuesday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 10),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                tuesday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 11),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                wednesday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 11),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                wednesday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 12),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                thursday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 12),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                thursday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 13),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                friday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 13),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                friday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 14),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                saturday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 14),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                saturday: false
            },
            expectation: false
        }, {
            day: new Date(2020, 2, 15),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                sunday: true
            },
            expectation: true
        }, {
            day: new Date(2020, 2, 15),
            expectedTimelogDays: {
                ...dailyTimeLogSettingsBase.expectedTimelogDays,
                sunday: false
            },
            expectation: false
        }].forEach(({day, expectedTimelogDays, expectation}) =>
            it(`should serve whether a date is an expected weekday and false otherwise. Weekday: ${day.getDate()} configuredAsExpected: ${JSON.stringify(expectedTimelogDays)} expectedResult: ${expectation}`, async () => {

                expect(DailyTimeLogSettingsService.isExpectedWeekday(day, {
                        ...dailyTimeLogSettingsBase,
                        expectedTimelogDays
                    })
                ).toBe(expectation);
            }));
    });
});
