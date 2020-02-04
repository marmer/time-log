import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import DayView from "./DayView";
import {DayNavigatorProps} from "./DayNavigator";
import * as reactTest from "@testing-library/react";
import TimeLogService, {TimeLog} from "../core/TimeLogService";

jest.mock("./DayNavigator", () => (_: DayNavigatorProps) => <div>DayNavigator</div>);

describe("DayView", () => {
    describe("loading", () => {
        it("should show some kind of loading state as long as the request has not been finished yet", async () => {
            const someDay = new Date(2020, 2, 2);

            const underTest = reactTest.render(<DayView day={someDay}/>);

            expect(underTest.getByText("Loading..."))
        });

        it("should show existing entries if it's possible to load time logs", async () => {
            const someDay = new Date(2020, 2, 2);

            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([{
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            } as TimeLog]));

            const underTest = reactTest.render(<DayView day={someDay}/>);

            const actualDescription = await reactTest.waitForElement(() => underTest.getByText("fancy description for day " + someDay.toISOString()));
            expect(actualDescription).toBeVisible();
        });

        it("should not show the loading state if it was possible to load time logs", async () => {
            const someDay = new Date(2020, 2, 2);

            TimeLogService.getTimeLogsForDay = jest.fn().mockImplementation((_: Date) => Promise.resolve([{
                durationInMinutes: 1234,
                description: "fancy description for day " + someDay.toISOString()
            } as TimeLog]));

            const underTest = reactTest.render(<DayView day={someDay}/>);
            const loadingState = underTest.getByText("Loading...")

            await reactTest.waitForElementToBeRemoved(() => underTest.getByText("Loading..."));
        });
    });
});
