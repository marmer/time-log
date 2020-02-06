import TimeLogRepository from "./TimeLogRepository";
import {TimeLog} from "../core/TimeLogService";
import Lockr from "lockr";

describe("TimeLogRepository", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("getTimeLogsForDay", () => {
        it("should serve all existing timelogs related to the given day", async () => {
            Lockr.set("TimeLog", {
                "2020-05-03": [{
                    durationInMinutes: 42,
                    description: "Some description"
                }, {
                    durationInMinutes: 43,
                    description: "Some otherdescription"
                }] as TimeLog[],
                "2020-06-03": [{
                    durationInMinutes: 44,
                    description: "some entry of another day"
                }] as TimeLog[]

            });

            const result = TimeLogRepository.getTimeLogsForDay(new Date(2020, 4, 3));

            expect(result).toStrictEqual([{
                durationInMinutes: 42,
                description: "Some description"
            }, {
                durationInMinutes: 43,
                description: "Some otherdescription"
            }]);
        });

        it("should serve an empty array if no timelogs exist yet for the related day", async () => {
            Lockr.set("TimeLog", {
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
});
