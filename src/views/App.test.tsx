import React from 'react';
import App from './App';
import {MemoryRouter, Router} from 'react-router-dom'
import * as reactTest from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {DayViewProps} from "./DayView";
import {createMemoryHistory} from 'history'
import moment from "moment";
import {NotFoundViewProps} from "./NotFoundView";
import {LoginViewProps} from "./LoginView";

jest.mock("./DayView", () => (props: DayViewProps): React.ReactNode => <div>
    <div>{
        require("moment")(props.day).format("YYYY-MM-DD").toString()
    }</div>
    <div>{(props as any).location}</div>
</div>);
jest.mock("./NotFoundView", () => (props: NotFoundViewProps): React.ReactNode => <div>
    <p>NotFoundView</p>
    <p>{props.location}</p>
</div>);

jest.mock("./HeaderView", () => (): React.ReactNode => <div>fancy header view</div>);

jest.mock("./LoginView", () => (props: LoginViewProps): React.ReactNode => <div>
    <h1>fancy login view</h1>
    <p>{props.searchString}</p>
</div>);

describe("App", () => {
    describe("default route", () => {
        it("the default route should redirect to todays day route", async () => {
            const history = createMemoryHistory();
            history.push("/");

            const wrapper = reactTest.render(
                <Router history={history}>
                    <App/>
                </Router>
            );

            expect(wrapper.getByText(moment().format("YYYY-MM-DD"))).toBeVisible();
            expect(history.location.pathname).toStrictEqual("/days/today");
        });
    });

    describe("day routes", () => {

        it("the default day route should redirect to todays day route", async () => {
            const history = createMemoryHistory();
            history.push("/days");

            const wrapper = reactTest.render(
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

            const wrapper = reactTest.render(
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

            const wrapper = reactTest.render(
                <Router history={history}>
                    <App/>
                </Router>
            );

            expect(wrapper.getByText("NotFoundView")).toBeVisible();
            expect(wrapper.getByText("/days/2020-02-30")).toBeVisible();
        });

        it("should show a not found message on an not existing route", async () => {
            const wrapper = reactTest.render(
                <MemoryRouter initialEntries={['/Definitely/NotExisting/path']}>
                    <App/>
                </MemoryRouter>
            );

            expect(wrapper.getByText("NotFoundView")).toBeVisible();
            expect(wrapper.getByText("/Definitely/NotExisting/path")).toBeVisible();
        });

    });
    describe("header", () => {
        it("should render a header", async () => {
            const wrapper = reactTest.render(
                <MemoryRouter initialEntries={['/']}>
                    <App/>
                </MemoryRouter>
            );

            expect(wrapper.getByText("fancy header view")).toBeVisible()
        });
    });
    describe("Login routes", () => {
        it("should render the login view for a login path with the relevant properties set", async () => {
            const wrapper = reactTest.render(
                <MemoryRouter initialEntries={['/login/bla?someSearch=string']}>
                    <App/>
                </MemoryRouter>
            );

            const loginView = wrapper.getByText("fancy login view");
            expect(loginView).toBeVisible();
            const loginViewContainer = reactTest.within(loginView.closest("div") as any);
            expect(loginViewContainer.getByText("?someSearch=string")).toBeVisible();

        });
    });
});
