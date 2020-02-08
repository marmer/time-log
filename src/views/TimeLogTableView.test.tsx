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


            for (let index = 0; index < entries.length; index++) {
                let timeLog = entries[index];
                const timelogIdCell = await reactTest.waitForElement(() => underTest.getByTitle("TimeLog " + index));
                const row = timelogIdCell.closest("tr");

                const util = reactTest.within(row as any);
                expect(util.getByDisplayValue(timeLog.description)).toBeVisible();
                expect(util.getByDisplayValue(timeLog.durationInMinutes.toString())).toBeVisible();
            }
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
        it("should add an element at the end it the last add button has been clicked", async () => {
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
        it("should add an element before the clicked add button row", async () => {
            const firstExpectedEntry = {
                durationInMinutes: 111,
                description: "as first description expected"
            };
            const secondExpectedEntry = {
                durationInMinutes: 0,
                description: ""
            };
            const thirdExpectedEntry = {
                durationInMinutes: 333,
                description: "as third description expected"
            };
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([firstExpectedEntry, thirdExpectedEntry] as TimeLog[]));

            const underTest = reactTest.render(<TimeLogTableView day={new Date(2020, 2, 2)}/>);

            //loading finished
            await reactTest.wait(() => expect(underTest.getByTitle("TimeLog 0")).toBeVisible());


            const secondRow = (await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 1").closest("tr")));
            const addBeforeButton = reactTest.within(secondRow as any).getByTitle("add before");
            userEvent.click(addBeforeButton);


            userEvent.click(underTest.getByTitle("add"));

            const outputExpectation = [firstExpectedEntry, secondExpectedEntry, thirdExpectedEntry];

            for (let index = 0; index < outputExpectation.length; index++) {
                let timeLog = outputExpectation[index];
                const timelogIdCell = await reactTest.waitForElement(() => underTest.getByTitle("TimeLog " + index));
                const row = timelogIdCell.closest("tr");

                const util = reactTest.within(row as any);
                expect(util.getByDisplayValue(timeLog.description)).toBeVisible();
                expect(util.getByDisplayValue(timeLog.durationInMinutes.toString())).toBeVisible();
            }
        });
    });

    describe("Remove an element", () => {
        it("should remove an element the remove button has been clicked", async () => {
            const firstExpectedEntry = {
                durationInMinutes: 111,
                description: "as first description expected"
            };
            const secondExpectedEntry = {
                durationInMinutes: 333,
                description: "as third description expected"
            };
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([firstExpectedEntry, secondExpectedEntry] as TimeLog[]));

            const underTest = reactTest.render(<TimeLogTableView day={new Date(2020, 2, 2)}/>);

            //loading finished
            await reactTest.wait(() => expect(underTest.getByTitle("TimeLog 0")).toBeVisible());

            const secondRow = (await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 1").closest("tr")));
            const addBeforeButton = reactTest.within(secondRow as any).getByTitle("remove");
            userEvent.click(addBeforeButton);

            expect(secondRow).not.toBeInTheDocument();
            expect(underTest.getByDisplayValue(firstExpectedEntry.description)).toBeVisible();
        })
    });

    describe("save", () => {
        it("should should save the current state if the save button is clicked", async () => {


            const entryBeforeUpdate = {
                durationInMinutes: 111,
                description: "description before update"
            };
            const entryWhileUpdate = {
                durationInMinutes: 222,
                description: "description while update"
            };
            const entryAfterUpdate = {
                durationInMinutes: 333,
                description: "description after update"
            };

            TimeLogService.storeTimeLogsForDay = jest.fn().mockImplementation((_: Date, __: TimeLog[]) => Promise.resolve([entryAfterUpdate]));
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([entryBeforeUpdate] as TimeLog[]));

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimeLogTableView day={day}/>);

            //loading finished
            const descriptionField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.description));
            const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.durationInMinutes.toString()));
            userEvent.type(descriptionField, entryWhileUpdate.description);
            userEvent.type(durationField, entryWhileUpdate.durationInMinutes.toString());

            expect(descriptionField).toHaveValue(entryWhileUpdate.description);
            expect(durationField).toHaveValue(entryWhileUpdate.durationInMinutes.toString());

            userEvent.click(underTest.getByText("save"));

            expect(TimeLogService.storeTimeLogsForDay).toBeCalledWith(day, [entryWhileUpdate]);

            await reactTest.waitForDomChange();
            expect(descriptionField).toHaveValue(entryAfterUpdate.description);
            expect(durationField).toHaveValue(entryAfterUpdate.durationInMinutes.toString());

        });
        it("should should save the current state on submit", async () => {
            const entryBeforeUpdate = {
                durationInMinutes: 111,
                description: "description before update"
            };
            const entryWhileUpdate = {
                durationInMinutes: 222,
                description: "description while update"
            };
            const entryAfterUpdate = {
                durationInMinutes: 333,
                description: "description after update"
            };

            TimeLogService.storeTimeLogsForDay = jest.fn().mockImplementation((_: Date, __: TimeLog[]) => Promise.resolve([entryAfterUpdate]));
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([entryBeforeUpdate] as TimeLog[]));

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimeLogTableView day={day}/>);

            //loading finished
            const descriptionField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.description));
            const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.durationInMinutes.toString()));
            userEvent.type(descriptionField, entryWhileUpdate.description);
            userEvent.type(durationField, entryWhileUpdate.durationInMinutes.toString());

            expect(descriptionField).toHaveValue(entryWhileUpdate.description);
            expect(durationField).toHaveValue(entryWhileUpdate.durationInMinutes.toString());

            reactTest.fireEvent.submit(durationField);

            expect(TimeLogService.storeTimeLogsForDay).toBeCalledWith(day, [entryWhileUpdate]);

            await reactTest.waitForDomChange();
            expect(descriptionField).toHaveValue(entryAfterUpdate.description);
            expect(durationField).toHaveValue(entryAfterUpdate.durationInMinutes.toString());

        });
    });
});
