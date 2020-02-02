import React from 'react';
import App from './App';
import {MemoryRouter, Router} from 'react-router-dom'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {DayViewProps} from "./DayView";
import {createMemoryHistory} from 'history'

jest.mock("./DayView", () => (props: DayViewProps): React.ReactNode => <div>
    <div>{props.day}</div>
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

            expect(wrapper.getByText("today")).toBeVisible();
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

        expect(wrapper.getByText("today")).toBeVisible();
        expect(history.location.pathname).toStrictEqual("/days/today");
    });

    it("should render a day view with a property set to the according path", async () => {
        const history = createMemoryHistory();
        history.push("/days/tomorrow");

        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(wrapper.getByText("tomorrow")).toBeVisible();
        expect(history.location.pathname).toStrictEqual("/days/tomorrow");
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
