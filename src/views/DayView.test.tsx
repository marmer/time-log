import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import DayView from "./DayView";
import {DayNavigatorProps} from "./DayNavigator";
import * as reactTest from "@testing-library/react";
import {TimelogDayViewProps} from "./TimelogDayView";

jest.mock("./DayNavigator", () => (props: DayNavigatorProps) => <div>DayNavigator+{props.day.toISOString()}</div>);
jest.mock("./TimelogDayView", () => (props: TimelogDayViewProps) =>
    <div>TimelogDayView+{props.day.toISOString()}</div>);

describe("DayView", () => {
    it("should show the day navigator for the appropriate day", async () => {
        const day = new Date(2002, 3, 4);
        const underTest = reactTest.render(<DayView day={day}/>);

        underTest.getByText("DayNavigator+" + day.toISOString());
    });
    it("should show the time logs for the appropriate day", async () => {
        const day = new Date(2020, 3, 4);
        const underTest = reactTest.render(<DayView day={day}/>);
        underTest.getByText("TimelogDayView+" + day.toISOString());
    });
});
