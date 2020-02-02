import React from 'react';
import App from './App';
import {MemoryRouter, Router} from 'react-router-dom'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {DayViewProps} from "./DayView";
import {createMemoryHistory} from 'history'
import moment from "moment";

jest.mock("./DayView", () => (props: DayViewProps): React.ReactNode => <div>
    <div>{
        require("moment")(props.day).format("YYYY-MM-DD").toString()
    }</div>
    <div>{(props as any).location}</div>
</div>);
jest.mock("./NotFoundView", () => (): React.ReactNode => <div>NotFoundView</div>);

describe("App", () => {
    describe("default route", () => {
        it("the default route should redirect to todays day route", async () => {
            const history = createMemoryHistory();
            history.push("/");

            const wrapper = render(
                <Router history={history}>
                    <App/>
                </Router>
            );

            expect(wrapper.getByText(moment().format("YYYY-MM-DD"))).toBeVisible();
            expect(history.location.pathname).toStrictEqual("/days/today");
        });
    });


    it("the default day route should redirect to todays day route", async () => {
        const history = createMemoryHistory();
        history.push("/days");

        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(wrapper.getByText(moment().format("YYYY-MM-DD"))).toBeVisible();
        expect(history.location.pathname).toStrictEqual("/days/today");
    });

    it("should render a day view when the day is valid with a property set to the according path", async () => {
        const history = createMemoryHistory();
        history.push("/days/2020-02-02");

        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(wrapper.getByText("2020-02-02")).toBeVisible();
        expect(history.location.pathname).toStrictEqual("/days/2020-02-02");
    });
    it("should render a not found view when the day is invalid with a property set to the according path", async () => {
        const history = createMemoryHistory();
        history.push("/days/2020-02-30");

        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(wrapper.getByText("NotFoundView")).toBeVisible();
    });

    it("should show a not found message on an not existing route", async () => {
        const wrapper = render(
            <MemoryRouter initialEntries={['/Definitely/NotExisting/path']}>
                <App/>
            </MemoryRouter>
        );

        expect(wrapper.getByText("NotFoundView")).toBeVisible();
    });
});
