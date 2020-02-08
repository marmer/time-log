import TimeLogService, {TimeLog} from "./TimeLogService";
import TimeLogRepository from "../local/TimeLogRepository";


describe("TimeLogService", () => {
    describe("getTimeLogsForDay", () => {
        it("should serve all existing Timelogs of the given day", async () => {
            const expectedTimeLog = {
                description: "some description",
                durationInMinutes: 42,
                day: new Date(2020, 2, 2)
            };
            TimeLogRepository.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => [expectedTimeLog]);


            const result = TimeLogService.getTimeLogsForDay(new Date(2020, 2, 2));

            expect(result).resolves.toStrictEqual([expectedTimeLog]);
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
            TimeLogRepository.saveTimelogs = jest.fn().mockImplementation((_: Date, __: TimeLog[]) => [savedTimelog]);

            const result = TimeLogService.saveTimeLogsForDay(new Date(2020, 2, 2), [timelogToSave]);

            expect(result).resolves.toStrictEqual([savedTimelog]);
            expect(TimeLogRepository.saveTimelogs).toBeCalledWith(new Date(2020, 2, 2), [timelogToSave]);
        });
    });
});
