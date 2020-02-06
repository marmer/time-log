import TimeLogService from "./TimeLogService";
import TimeLogRepository from "../local/TimeLogRepository";


describe("TimeLogService", () => {
    it("should serve all existing Timelogs of the given day", async () => {
        const expectedTimeLog = {
            description: "some description",
            durationInMinutes: 42,
            day: new Date(2020, 2, 2)
        };
        TimeLogRepository.getTimeLogsForDay = jest.fn().mockImplementation((day: Date) => [expectedTimeLog]);


        const result = TimeLogService.getTimeLogsForDay(new Date(2020, 2, 2));

        expect(result).resolves.toStrictEqual([expectedTimeLog]);
        expect(TimeLogRepository.getTimeLogsForDay).toBeCalledWith(new Date(2020, 2, 2));

    });
});
