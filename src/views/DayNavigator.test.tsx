import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import DayNavigator from "./DayNavigator";
import * as reactTest from "@testing-library/react";
import {Router} from "react-router-dom";
import {createMemoryHistory} from "history";

let onChangeCallback: (day: Date) => void;

jest.mock("react-datepicker", () => (props: {
    onChange: (day: Date) => void,
    selected: Date
}) => {
    onChangeCallback = props.onChange;
    return <div><p>datePicker</p>
        <p>{props.selected.toISOString()}</p></div>
});

describe("DayNavigator", () => {

    beforeEach(() => {
        window.location.reload = jest.fn();
    });

    it("should show the given day", async () => {
        const day = new Date(2005, 3, 7);
        const history = createMemoryHistory();

        const underTest = reactTest.render(<Router history={history}><DayNavigator day={day}/></Router>);

        expect(underTest.getByText(day.toISOString())).toBeVisible();
    });

    it("should change and reload the site depending on the chosen day", async () => {
        const day = new Date(2005, 3, 7);
        const history = createMemoryHistory();
        reactTest.render(<Router history={history}><DayNavigator day={day}/></Router>);

        await reactTest.wait(() => onChangeCallback(new Date(2000, 2, 17)));

        expect(history.location.pathname).toBe("/days/2000-03-17");
        expect(window.location.reload).toBeCalled();

    });
});
