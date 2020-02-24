import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import DayNavigator from "./DayNavigator";
import * as reactTest from "@testing-library/react";
import {Router} from "react-router-dom";
import {createMemoryHistory} from "history";
import userEvent from "@testing-library/user-event";

let onChangeCallback: (day: Date | null) => void;

jest.mock("react-datepicker", () => (props: {
    onChange: (day: Date | null) => void,
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

    it("should not reload the site if no day has been chosen on change", async () => {

        const day = new Date(2005, 3, 7);
        const history = createMemoryHistory();
        history.push("/days/1985-01-02");

        reactTest.render(<Router history={history}><DayNavigator day={day}/></Router>);

        await reactTest.wait(() => onChangeCallback(null));

        expect(history.location.pathname).toBe("/days/1985-01-02");
    });

    it("should go the the next day when the next day button is clicked", async () => {
        const day = new Date(2020, 1, 29);
        const history = createMemoryHistory();
        const underTest = reactTest.render(<Router history={history}><DayNavigator day={day}/></Router>);

        const nextDayButton = underTest.getByTitle("go day forward");

        userEvent.click(nextDayButton);

        expect(history.location.pathname).toBe("/days/2020-03-01");
        expect(window.location.reload).toBeCalled();
    });

    it("should go the the last day when the next day button is clicked", async () => {
        const day = new Date(2020, 2, 1);
        const history = createMemoryHistory();
        const underTest = reactTest.render(<Router history={history}><DayNavigator day={day}/></Router>);

        const preveousDayButton = underTest.getByTitle("go day back");

        userEvent.click(preveousDayButton);

        expect(history.location.pathname).toBe("/days/2020-02-29");
        expect(window.location.reload).toBeCalled();
    });
});
