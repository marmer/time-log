import TimeLogRepository from "./TimeLogRepository";
import TimeLogDatabase from "./TimeLogDatabase";
import {TimeLog} from "../core/TimeLogService";

const timelogBase: TimeLog = {durationInMinutes: 42, description: "to Save"};
describe("TimeLogRepository", () => {
    const db: TimeLogDatabase = new TimeLogDatabase();

    beforeEach(async () => {
        await db.clearAllTables();
    });

    describe("getTimeLogsForDay", () => {
        it("should serve all existing timelogs related to the given day", async () => {
            await db.timelogDay.bulkPut([{
                day: "2020-05-03", timelogs: [{
                    durationInMinutes: 42,
                    description: "Some description"
                }, {
                    durationInMinutes: 43,
                    description: "Some otherdescription"
                }]
            }, {
                day: "2020-05-04",
                timelogs: [{
                    durationInMinutes: 44,
                    description: "some entry of another day"
                }]
            }]);

            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            await expect(result).resolves.toStrictEqual([{
                durationInMinutes: 42,
                description: "Some description"
            }, {
                durationInMinutes: 43,
                description: "Some otherdescription"
            }]);
        });

        it("should serve an empty array if no timelogs exist yet for the related day", async () => {
            await db.timelogDay.put({
                day: "2020-06-03",
                timelogs: [{
                    durationInMinutes: 44,
                    description: "some entry of another day"
                }]
            });

            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            return expect(result).resolves.toStrictEqual([])
        });

        it("should serve an empty array if nothing has ever been stored yet", async () => {
            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            return expect(result).resolves.toStrictEqual([])
        });
    });

    describe("saveTimelogs", () => {
        it("should save the given timeLogs at the specific day when nothing has been saved before", async () => {
            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const day = new Date(1985, 0, 2);
            const result = await TimeLogRepository.saveTimelogs(day, [timelogToSave]);


            const storedTimelog = await db.timelogDay.get("1985-01-02");
            expect(storedTimelog).toStrictEqual({
                day: "1985-01-02", timelogs: [timelogToSave]
            });
            expect(result).toStrictEqual([timelogToSave]);
        });

        it("should save timelogs without removing existing ones on different dates", async () => {
            const timelogOfADifferentDay = {
                durationInMinutes: 44,
                description: "some entry of another day"
            };
            db.timelogDay.put({
                day: "1985-06-03",
                timelogs: [timelogOfADifferentDay]
            });
            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const day = new Date(1985, 5, 2);
            const result = await TimeLogRepository.saveTimelogs(day, [timelogToSave]);

            const storedTimelog = await db.timelogDay.get("1985-06-02");
            expect(storedTimelog).toStrictEqual({day: "1985-06-02", timelogs: [timelogToSave]});
            expect(result).toStrictEqual([timelogToSave]);

            const storedOtherTimelog = await db.timelogDay.get("1985-06-03");
            expect(storedOtherTimelog).toStrictEqual({day: "1985-06-03", timelogs: [timelogOfADifferentDay]});

        });

        it("should override existing timelogs for the same day", async () => {
            const existingTimelog = {
                durationInMinutes: 42,
                description: "some entry"
            };

            const day = new Date(1985, 5, 3);
            db.timelogDay.put({
                day: "1985-06-03",
                timelogs: [existingTimelog]
            });

            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const result = await TimeLogRepository.saveTimelogs(day, [timelogToSave]);

            const storedOtherTimelog = await db.timelogDay.get("1985-06-03");
            expect(storedOtherTimelog).toStrictEqual({day: "1985-06-03", timelogs: [timelogToSave]});
            expect(result).toStrictEqual([timelogToSave]);
        });
    });

    describe("getExpectedTimeToLogDeltaInMonthInMinutesUntil", () => {
        it("should serve the sum of logged time for the relevant time only", async () => {
            db.timelogDay.bulkPut([{
                day: "2020-03-05",
                timelogs: [{
                    ...timelogBase,
                    durationInMinutes: 3
                }]
            }, {
                day: "2020-03-06",
                timelogs: [{
                    ...timelogBase,
                    durationInMinutes: 5
                }]
            }, {
                day: "2020-03-08",
                timelogs: [{
                    ...timelogBase,
                    durationInMinutes: 7
                }, {
                    ...timelogBase,
                    durationInMinutes: 11
                }]
            }, {
                day: "2020-03-09",
                timelogs: [{
                    ...timelogBase,
                    durationInMinutes: 13
                }]
            }]);

            const result = await TimeLogRepository.getSumOfTimeLoggedBetween(new Date(2020, 2, 6), new Date(2020, 2, 8));
            expect(result).toBe(23);
        });
    });
});
