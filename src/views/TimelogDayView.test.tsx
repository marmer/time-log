import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import * as reactTest from "@testing-library/react";
import TimeLogService, {TimeLog} from "../core/TimeLogService";
import TimelogDayView from "./TimelogDayView";
import userEvent from "@testing-library/user-event";
import JiraTimeService from "../core/JiraTimeService";
import ReactTestUtils from 'react-dom/test-utils';
import SettingsService from "../core/SettingsService";

const emptyTimelog: TimeLog = {
    description: "",
    durationInMinutes: 0
};

const baseTimeLog: TimeLog = {
    ...emptyTimelog,
    description: "vacation",
    durationInMinutes: 42
};
describe("TimelogDayView", () => {

    beforeEach(() => {
        jest.fn().mockReset();
        JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(minutes => minutes.toString());
        JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation(jiraFormat => jiraFormat ? Number.parseInt(jiraFormat) : 0);
        JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);
        SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(42);
    });

    describe("loading", () => {
        it("should show some kind of loading state as long as the request has not been finished yet", async () => {
            const someDay = new Date(2020, 2, 2);

            const underTest = reactTest.render(<TimelogDayView day={someDay}/>);

            expect(underTest.getByText("Loading..."))
        });

        it("should show existing entries if it's possible to load time logs", async () => {
            const someDay = new Date(2020, 2, 2);

            const entries: TimeLog[] = [{
                ...baseTimeLog,
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            }, {
                ...baseTimeLog,
                durationInMinutes: 4321,
                description: "fancy other description"
            }];
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve(entries));

            const underTest = reactTest.render(<TimelogDayView day={someDay}/>);


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
                ...baseTimeLog,
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            } as TimeLog]));

            const underTest = reactTest.render(<TimelogDayView day={someDay}/>);
            underTest.getByText("Loading...");
            await reactTest.waitForElementToBeRemoved(() => underTest.getByText("Loading..."));
        });
    });

    describe("Add element", () => {
        it("should add an element before the clicked add button row", async () => {
            const firstExpectedEntry = {
                ...baseTimeLog,
                durationInMinutes: 111,
                description: "as first description expected"
            };
            const secondExpectedEntry = {
                ...baseTimeLog,
                durationInMinutes: "",
                description: ""
            };
            const thirdExpectedEntry = {
                ...baseTimeLog,
                durationInMinutes: 333,
                description: "as third description expected"
            };
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([firstExpectedEntry, thirdExpectedEntry] as TimeLog[]));

            const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

            //loading finished
            await reactTest.wait(() => expect(underTest.getByTitle("TimeLog 0")).toBeVisible());


            const secondRow = (await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 1").closest("tr")));
            const addBeforeButton = reactTest.within(secondRow as any).getByTitle("add before this entry");
            userEvent.click(addBeforeButton);


            const outputExpectation = [firstExpectedEntry, secondExpectedEntry, thirdExpectedEntry];

            for (let index = 0; index < outputExpectation.length; index++) {
                let timeLog = outputExpectation[index];
                const timelogIdCell = await reactTest.waitForElement(() => underTest.getByTitle("TimeLog " + index));
                const row = timelogIdCell.closest("tr");

                const util = reactTest.within(row as any);
                expect(util.getByTitle("description")).toHaveValue(timeLog.description);
                expect(util.getByTitle("duration")).toHaveValue(timeLog.durationInMinutes.toString());
            }
        });
        it("should add automatically a timelog at the end if no timelogs exist on mount", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([]);

            const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

            expect(await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 0"))).toBeVisible();

            expect(underTest.queryByTitle("TimeLog 1")).not.toBeInTheDocument();
        });

        it("should add automatically a timelog at the end if any input value exist on the last element", async () => {
            const firstEntry = {
                ...baseTimeLog,
                durationInMinutes: 111,
                description: "as first description expected"
            };

            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([firstEntry]);

            const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

            const secondEntryIndex = await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 1"));
            expect(secondEntryIndex).toBeVisible();

            expect(underTest.queryByTitle("TimeLog 2")).not.toBeInTheDocument();
            const secondEntryRow = secondEntryIndex.closest("tr") as any;
            const descriptionFieldOfSecondInput = reactTest.getByTitle(secondEntryRow, "description");
            userEvent.type(descriptionFieldOfSecondInput, "a");

            expect(await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 2"))).toBeVisible();
        });
    });

    describe("Remove an element", () => {
        it("should remove an element the remove button has been clicked", async () => {
            const firstEntry = {
                ...baseTimeLog,
                durationInMinutes: 111,
                description: "as first description expected"
            };
            const secondEntry = {
                ...baseTimeLog,
                durationInMinutes: 222,
                description: "as second description expected"
            };
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([firstEntry, secondEntry] as TimeLog[]));

            const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

            //loading finished
            const originalFirstRow = (await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 0").closest("tr")));
            expect(reactTest.within(originalFirstRow as any).getByDisplayValue(firstEntry.description)).toBeVisible();
            const originalFirstRowRemoveButton = reactTest.within(originalFirstRow as any).getByTitle("remove this entry");
            userEvent.click(originalFirstRowRemoveButton);

            const newFirstRow = (await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 0").closest("tr")));
            expect(reactTest.within(newFirstRow as any).getByDisplayValue(secondEntry.description)).toBeVisible();
        });

        it("should not show a remove button if it's the last element in the list", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([]);

            const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

            await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 0"));

            expect(underTest.queryByTitle("remove this entry")).not.toBeInTheDocument();
        });
    });

    describe("validation", () => {
        describe("duration", () => {
            describe("invalid", () => {
                it("should mark the duration input if the typed value is not a valid duration", async () => {
                    const firstExpectedEntry = {
                        durationInMinutes: 111,
                        description: "as first description expected"
                    };
                    TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([firstExpectedEntry] as TimeLog[]);
                    JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(input => input === "111");

                    const underTest = reactTest.render(<TimelogDayView day={new Date(2020, 2, 2)}/>);

                    const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue("111"));

                    expect(durationField.classList).not.toContain("invalid-format");

                    userEvent.type(durationField, "invalid jira string");

                    expect(durationField.classList).toContain("invalid-format");

                    userEvent.type(durationField, "111");

                    expect(durationField.classList).not.toContain("invalid-format");
                });
            });
        });
    });

    describe("save", () => {
        it("should should save the current state if the save button is clicked", async () => {
            const entryBeforeUpdate = {
                ...baseTimeLog,
                durationInMinutes: 111,
                description: "description before update"
            };
            const entryWhileUpdate = {
                ...baseTimeLog,
                durationInMinutes: 222,
                description: "description while update"
            };
            const entryAfterUpdate = {
                ...baseTimeLog,
                durationInMinutes: 333,
                description: "description after update"
            };

            TimeLogService.saveTimeLogsForDay = jest.fn().mockImplementation((_: Date, __: TimeLog[]) => Promise.resolve([entryAfterUpdate]));
            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([entryBeforeUpdate] as TimeLog[]));
            JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            //loading finished
            const descriptionField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.description));
            const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.durationInMinutes.toString()));
            userEvent.type(descriptionField, entryWhileUpdate.description);
            userEvent.type(durationField, entryWhileUpdate.durationInMinutes.toString());

            expect(descriptionField).toHaveValue(entryWhileUpdate.description);
            expect(durationField).toHaveValue(entryWhileUpdate.durationInMinutes.toString());

            userEvent.click(underTest.getByText("save"));

            expect(TimeLogService.saveTimeLogsForDay).toBeCalledWith(day, [entryWhileUpdate]);

            await reactTest.waitForDomChange();
            expect(descriptionField).toHaveValue(entryAfterUpdate.description);
            expect(durationField).toHaveValue(entryAfterUpdate.durationInMinutes.toString());

        });

        it("should should save the current state on submit", async () => {
            const entryBeforeUpdate = {
                ...baseTimeLog,
                durationInMinutes: 15,
                description: "description before update"
            };
            const entryWhileUpdate = {
                ...baseTimeLog,
                durationInMinutes: 30,
                description: "description while update"
            };
            const entryAfterUpdate = {
                ...baseTimeLog,
                durationInMinutes: 45,
                description: "description after update"
            };

            TimeLogService.saveTimeLogsForDay = jest.fn().mockResolvedValue([entryAfterUpdate]);
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([entryBeforeUpdate]);

            JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(minutes => minutes + "x");
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation(jiraFormat => Number.parseInt(jiraFormat));
            JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            //loading finished
            const descriptionField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entryBeforeUpdate.description));
            const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue("15x"));
            userEvent.type(descriptionField, entryWhileUpdate.description);
            userEvent.type(durationField, "30x");

            expect(descriptionField).toHaveValue(entryWhileUpdate.description);
            expect(durationField).toHaveValue("30x");

            reactTest.fireEvent.submit(durationField);

            expect(TimeLogService.saveTimeLogsForDay).toBeCalledWith(day, [entryWhileUpdate]);

            await reactTest.waitForDomChange();
            expect(descriptionField).toHaveValue(entryAfterUpdate.description);
            expect(durationField).toHaveValue("45x");

        });

        it("should not be possible to submit if any duration is invaild", async () => {
            const timeLog = {
                ...baseTimeLog,
                durationInMinutes: 15,
                description: "description before update"
            };

            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([timeLog]);

            JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(jiraString => jiraString !== "invalidJiraString");

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            const saveButton = await reactTest.waitForElement(() => underTest.getByText("save"));

            expect(saveButton).toBeEnabled();

            const durationField = await reactTest.waitForElement(() => underTest.getByDisplayValue("15"));
            userEvent.type(durationField, "invalidJiraString");

            expect(saveButton).toBeDisabled();
            userEvent.type(durationField, "valid jira string");
            expect(saveButton).toBeEnabled();

            reactTest.fireEvent.submit(durationField);

            expect(TimeLogService.saveTimeLogsForDay).not.toBeCalledWith();
        });
        it("should save the current state if the save shortcut has been triggered on the document", async () => {
            const entry = {
                ...baseTimeLog,
                durationInMinutes: 111,
                description: "description before update"
            };


            TimeLogService.saveTimeLogsForDay = jest.fn().mockResolvedValue([entry]);
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([entry]);
            JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            //loading finished
            const descriptionField = await reactTest.waitForElement(() => underTest.getByDisplayValue(entry.description));
            userEvent.type(descriptionField, "somethingNewDescriptionForUpdate");

            const basePanel = underTest.container.querySelectorAll("*")[0];

            ReactTestUtils.Simulate.keyDown(basePanel, {
                ctrlKey: true,
                key: "s"
            });

            expect(TimeLogService.saveTimeLogsForDay).toBeCalledWith(day, [{
                ...entry,
                description: "somethingNewDescriptionForUpdate"
            }]);
        });

        it("should save even if no timelogs are there to save", async () => {

            TimeLogService.saveTimeLogsForDay = jest.fn().mockResolvedValue([]);
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([]);
            JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            //loading finished
            await reactTest.waitForElement(() => underTest.getByTitle("TimeLog 0"));

            userEvent.click(underTest.getByText("save"));

            expect(TimeLogService.saveTimeLogsForDay).toBeCalledWith(day, []);
        })

    });

    describe("statistics", () => {
        it("should show the sum of all the currently worked time somewhere", async () => {
            const entry1 = {
                ...baseTimeLog,
                durationInMinutes: 15,
                description: "description before update"
            };
            const entry2 = {
                ...baseTimeLog,
                durationInMinutes: 32,
                description: "description before update"
            };

            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([entry1, entry2]);

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            expect(await reactTest.waitForElement(() => underTest.getByText("47"))).toBeVisible();

            const durationField = underTest.getByDisplayValue("32");
            expect(durationField).toHaveAttribute("title", "duration");

            userEvent.type(durationField, "8");

            expect(await reactTest.waitForElement(() => underTest.getByText("23")));
        });

        it("should show the sum of valid values but ignores invalid ones", async () => {
            const entry1 = {
                ...baseTimeLog,
                durationInMinutes: 15,
                description: "description before update"
            };
            const entry2 = {
                ...baseTimeLog,
                durationInMinutes: 32,
                description: "description before update"
            };

            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([entry1, entry2]);
            JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(v => v !== "invalidValue");

            const day = new Date(2020, 2, 2);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            expect(await reactTest.waitForElement(() => underTest.getByText("47"))).toBeVisible();

            const durationField = underTest.getByDisplayValue("32");
            expect(durationField).toHaveAttribute("title", "duration");

            userEvent.type(durationField, "invalidValue");

            expect(await reactTest.waitForElement(() => underTest.getByText("15")));
        });
    });

    describe("Overtime Calculation", () => {
        it("should calculate the overtime based on the configured expected daily time to log and the already logged time today", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([{
                ...baseTimeLog,
                durationInMinutes: 70
            } as TimeLog]);

            const day = new Date(2020, 2, 2);
            SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(100);

            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            const overtimeField = await reactTest.waitForElement(() => underTest.getByTitle("time left today only"));

            expect(overtimeField).toHaveValue("30");
        });

        it("should calculete the overtime based on the configured expected daily time to log and the allready logged time this month", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([{
                ...baseTimeLog,
                durationInMinutes: 70
            } as TimeLog]);

            const day = new Date(2020, 2, 2);
            const dayBeforeCurrent = new Date(2020, 2, 1);

// TODO: marmer 24.02.2020 handle error here in a different test
            SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(100);
// TODO: marmer 24.02.2020 handle error here in a different test
            TimeLogService.getExpectedTimeToLogDeltaInMonthInMinutesUntill = jest.fn().mockImplementation(d => isEqualDate(d, dayBeforeCurrent) ? Promise.resolve(20) : Promise.reject(new Error("Unexpected value: " + d)));
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            const overtimeField = await reactTest.waitForElement(() => underTest.getByTitle("time left monthly"));

            expect(overtimeField).toHaveValue("50");

        });

        it("should calculete the overtime based on the configured expected daily time to log and the already logged time this month at the first of a month", async () => {
            TimeLogService.getTimeLogsForDay = jest.fn().mockResolvedValue([{
                ...baseTimeLog,
                durationInMinutes: 70
            } as TimeLog]);

            const day = new Date(2020, 2, 1);

            SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(100);
            const underTest = reactTest.render(<TimelogDayView day={day}/>);

            const overtimeField = await reactTest.waitForElement(() => underTest.getByTitle("time left monthly"));

            expect(overtimeField).toHaveValue("30");

        });
    });
});

function isEqualDate(date1: Date, date2: Date) {
    return date1 <= date2 && date1 >= date2;
}
