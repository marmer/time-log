import {TimeLogDatabase} from "../local/TimeLogDatabase";
import TimeLogService from "./TimeLogService";

require("fake-indexeddb/auto");

describe("TimeLogService", () => {
    it("should serve all existing Timelogs of the given day", async () => {
        const db = new TimeLogDatabase();

        const expectedItem = {description: "some description", durationInMinutes: 42, day: new Date(2020, 5, 7)};
        const unexpectedItem = {description: "some description", durationInMinutes: 42, day: new Date(2020, 5, 8)};

        db.timeLogs.put(expectedItem);
        db.timeLogs.put(unexpectedItem);

        const timelogs = await TimeLogService.getTimeLogsForDay(new Date(2020, 5, 7));

        expect(timelogs).toBe([{
            description: "some description",
            durationInMinutes: 42,
            day: new Date(2020, 5, 7)
        }]);
    });
});
