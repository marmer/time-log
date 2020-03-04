import TimeLogService, {TimeLog} from "./TimeLogService";
import TimeLogRepository from "../local/TimeLogRepository";
import DailyTimeLogSettingsService, {DailyTimelogSettings} from "./DailyTimeLogSettingsService";


const dailyTimelogSettingsBase: DailyTimelogSettings = {
    expectedDailyTimeToLogInMinutes: 123,
    expectedTimelogDays: {
        saturday: true,
        friday: true,
        thursday: true,
        wednesday: true,
        tuesday: true,
        monday: true,
        sunday: true,
    }
};

describe("TimeLogService", () => {
    describe("getTimeLogsForDay", () => {
        it("should serve all existing Timelogs of the given day", async () => {
            const expectedTimeLog = {
                description: "some description",
                durationInMinutes: 42,
                day: new Date(2020, 2, 1)
            };
            TimeLogRepository.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([expectedTimeLog]));


            const result = TimeLogService.getTimeLogsForDay(new Date(2020, 2, 2));

            await expect(result).resolves.toStrictEqual([expectedTimeLog]);
            expect(TimeLogRepository.getTimeLogsForDay).toBeCalledWith(new Date(2020, 2, 2));
        });
    });

    describe("saveTimeLogsForDay", () => {
        it("should store and return the given and stored timelogs", async () => {
            let timelogToSave: TimeLog = {
                description: "toStore",
                durationInMinutes: 1
            };
            const savedTimelog = {
                description: "stored",
                durationInMinutes: 2,
            };
            TimeLogRepository.saveTimelogs = jest.fn().mockImplementation((_: Date, __: TimeLog[]) => Promise.resolve([savedTimelog]));

            const result = TimeLogService.saveTimeLogsForDay(new Date(2020, 2, 2), [timelogToSave]);

            await expect(result).resolves.toStrictEqual([savedTimelog]);
            expect(TimeLogRepository.saveTimelogs).toBeCalledWith(new Date(2020, 2, 2), [timelogToSave]);
        });
    });

    describe("getExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive", () => {

        it("should serve the delta between logged and expected work to log from the beginning of the month to the day before the given one", async () => {
            DailyTimeLogSettingsService.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue({
                ...dailyTimelogSettingsBase,
                expectedDailyTimeToLogInMinutes: 10
            } as DailyTimelogSettings);
            TimeLogRepository.getSumOfTimeLoggedBetween = jest.fn().mockImplementation((start: Date, end: Date) => {
                if (!isDateEqual(start, new Date(2020, 1, 1))) {
                    throw new Error("Unexpected start: " + start);
                }
                if (!isDateEqual(end, new Date(2020, 1, 2))) {
                    throw new Error("Unexpected end: " + end);
                }
                return 8;
            });

            const delta = await TimeLogService.getExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive(new Date(2020, 1, 3));

            expect(delta).toBe(12)
        });

        it("should serve zero if the first of a month because it's impossible to have an expectation before a month has begun", async () => {
            const delta = await TimeLogService.getExpectedTimeToLogDeltaInMonthInMinutesUntilExclusive(new Date(2020, 1, 1));

            expect(delta).toBe(0)
        });
    });
});

function isDateEqual(actual: Date, expected: Date) {
    return actual <= expected && actual >= expected;
}
