import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import * as reactTest from "@testing-library/react";
import TimeLogService, {TimeLog} from "../core/TimeLogService";
import TimeLogTableView from "./TimeLogTableView";
import userEvent from "@testing-library/user-event";

describe("TimeLogTableView", () => {
    describe("loading", () => {
        it("should show some kind of loading state as long as the request has not been finished yet", async () => {
            const someDay = new Date(2020, 2, 2);

            const underTest = reactTest.render(<TimeLogTableView day={someDay}/>);

            expect(underTest.getByText("Loading..."))
        });

        it("should show existing entries if it's possible to load time logs", async () => {
            const someDay = new Date(2020, 2, 2);

            const entries: TimeLog[] = [{
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            }, {
                durationInMinutes: 4321,
                description: "fancy other description"
            }];
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve(entries));

            const underTest = reactTest.render(<TimeLogTableView day={someDay}/>);


            entries.forEach(async (timeLog, index) => {
                const timelogIdCell = await reactTest.waitForElement(() => underTest.getByTitle("TimeLog " + index));
                const row = timelogIdCell.closest("tr");

                const util = reactTest.within(row as any);
                expect(util.getByDisplayValue(timeLog.description)).toBeVisible();
                expect(util.getByDisplayValue(timeLog.durationInMinutes.toString())).toBeVisible();
            });
        });

        it("should not show the loading state if it was possible to load time logs", async () => {
            const someDay = new Date(2020, 2, 2);

            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([{
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            } as TimeLog]));

            const underTest = reactTest.render(<TimeLogTableView day={someDay}/>);
            underTest.getByText("Loading...");
            await reactTest.waitForElementToBeRemoved(() => underTest.getByText("Loading..."));
        });
    });

    describe("Add element", () => {
        it("should add and store an element at the end it the last add button has been clicked", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([{
                durationInMinutes: 1234,
                description: "existing description"
            } as TimeLog]));

            const underTest = reactTest.render(<TimeLogTableView day={new Date(2020, 2, 2)}/>);

            //loading finished
            await reactTest.wait(() => expect(underTest.getByTitle("TimeLog 0")).toBeVisible());
            expect(underTest.queryByTitle("TimeLog 1")).not.toBeInTheDocument();

            userEvent.click(underTest.getByTitle("add"));

            const timeLogIdField = underTest.getByTitle("TimeLog 1");
            expect(timeLogIdField).toBeVisible()
        });
    });
});
