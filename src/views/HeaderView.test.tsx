import HeaderView from "./HeaderView";
import * as reactTest from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from "react";
import {MemoryRouter, Router} from "react-router-dom";
import {createMemoryHistory} from 'history'

jest.mock("./UserView", () => (): React.ReactNode => <div>UserView</div>);

describe("HeaderView", () => {
    it("should show the project name somewhere", async () => {
        const underTest = reactTest.render(<MemoryRouter><HeaderView/></MemoryRouter>);

        expect(underTest.getByText("time-log")).toBeVisible();
    });

    describe("Navigation highlights", () => {
        it("should mark the settings location depending on the window location", async () => {
            const history = createMemoryHistory({
                initialEntries: ["/somewhere"]
            });

            const underTest = reactTest.render(<Router history={history}><HeaderView/></Router>);

            expect(underTest.getByText("Settings").classList).not.toContain("active");
            history.push("/settings");
            expect(underTest.getByText("Settings").classList).toContain("active");
        });

        it("should mark the day location depending on the window location", async () => {
            const history = createMemoryHistory({
                initialEntries: ["/somewhere"]
            });

            const underTest = reactTest.render(<Router history={history}><HeaderView/></Router>);

            expect(underTest.getByText("Logs").classList).not.toContain("active");
            history.push("/day");
            expect(underTest.getByText("Logs").classList).toContain("active");
            history.push("/day/someDay");
            expect(underTest.getByText("Logs").classList).toContain("active");
            history.push("/somewhereElse");
            expect(underTest.getByText("Logs").classList).not.toContain("active");
        });
    });
});
