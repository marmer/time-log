import TimeLogRepository from "./TimeLogRepository";
import {TimeLog} from "../core/TimeLogService";
import Lockr from "lockr";
import TimeLogDatabase from "./TimeLogDatabase";

const timeLogStoreKey = "TimeLog";

describe("TimeLogRepository", () => {
    let db: TimeLogDatabase;
    beforeEach(async () => {
        localStorage.clear();
        await new TimeLogDatabase().delete();
        db = new TimeLogDatabase();
    });

    afterEach(() => {
        if (!db.hasBeenClosed())
            db.close()
    });

    describe("getTimeLogsForDay", () => {
        it("should serve all existing timelogs related to the given day", async () => {
            await db.timelogDay.bulkPut([{
                day: new Date(2020, 4, 3), timelogs: [{
                    durationInMinutes: 42,
                    description: "Some description"
                }, {
                    durationInMinutes: 43,
                    description: "Some otherdescription"
                }]
            }, {
                day: new Date(2020, 4, 4),
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
            await Lockr.set(timeLogStoreKey + "-2020-05", {
                "2020-06-03": [{
                    durationInMinutes: 44,
                    description: "some entry of another day"
                }] as TimeLog[]

            });

            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            expect(result).toStrictEqual([])
        });

        it("should serve an empty array if nothing has ever been stored yet", async () => {
            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            expect(result).toStrictEqual([])
        });
    });

    describe("saveTimelogs", () => {
        it("should save the given timeLogs at the specific day when nothing has been saved before", async () => {
            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const result = TimeLogRepository.saveTimelogs(new Date(1985, 0, 2), [timelogToSave]);

            const storedTimelog = (Lockr.get(timeLogStoreKey + "-1985-01") as any)["1985-01-02"];
            expect(storedTimelog).toStrictEqual([timelogToSave]);
            expect(result).toStrictEqual([timelogToSave]);
        });

        it("should save timelogs without removing existing ones on different dates", async () => {
            const timelogOfADifferentDay = {
                durationInMinutes: 44,
                description: "some entry of another day"
            };
            Lockr.set(timeLogStoreKey + "-1985-06", {
                "1985-06-03": [timelogOfADifferentDay]
            });
            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const result = TimeLogRepository.saveTimelogs(new Date(1985, 5, 2), [timelogToSave]);

            const storedTimelog = (Lockr.get(timeLogStoreKey + "-1985-06") as any)["1985-06-02"];
            expect(storedTimelog).toStrictEqual([timelogToSave]);
            expect(result).toStrictEqual([timelogToSave]);

            const storedOtherTimelog = (Lockr.get(timeLogStoreKey + "-1985-06") as any)["1985-06-03"];
            expect(storedOtherTimelog).toStrictEqual([timelogOfADifferentDay]);

        });

        it("should override existing timelogs for the same day", async () => {
            const existingTimelog = {
                durationInMinutes: 42,
                description: "some entry"
            };
            Lockr.set(timeLogStoreKey + "-2020-06", {
                "2020-06-03": [existingTimelog]
            });
            const timelogToSave = {durationInMinutes: 42, description: "to Save"};
            const result = TimeLogRepository.saveTimelogs(new Date(2020, 5, 3), [timelogToSave]);

            const storedOtherTimelog = (Lockr.get(timeLogStoreKey + "-2020-06") as any)["2020-06-03"];
            expect(storedOtherTimelog).toStrictEqual([timelogToSave]);
            expect(result).toStrictEqual([timelogToSave]);
        });
    });
});
