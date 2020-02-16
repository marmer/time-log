import LoginView from "./LoginView";
import * as reactTest from "@testing-library/react"
import React from "react";
import LoginService, {LoginResult} from "../core/LoginService";
import {createMemoryHistory} from "history";
import {MemoryRouter, Router} from "react-router-dom";

const loginResultBase: LoginResult = {sourceUrl: "somewhere"};


describe("LoginView", () => {
    describe("User is not yet logged in", () => {
        it("should render some hint that the login is in progress", async () => {
            LoginService.loginBySearchString = jest.fn().mockResolvedValue({...loginResultBase});

            let underTest = reactTest.render(<MemoryRouter initialEntries={["i/dont/care"]}>
                <LoginView searchString={"?some=searchString"}/></MemoryRouter>);

            underTest.getByText("requesting user data...")
        });

        it("should try to log the user in by the given search string", async () => {
            LoginService.loginBySearchString = jest.fn().mockResolvedValue({...loginResultBase});

            const underTest = reactTest.render(<MemoryRouter initialEntries={["i/dont/care"]}>
                <LoginView searchString={"?some=searchString"}/></MemoryRouter>);

            expect(LoginService.loginBySearchString).toBeCalledWith("?some=searchString");
        });
    });

    describe("It is possible to log the user in", () => {
        it("should redirect to the login result target", async () => {
            LoginService.loginBySearchString = jest.fn().mockResolvedValue({
                ...loginResultBase,
                sourceUrl: "/some/mystical/place"
            } as LoginResult)

            const history = createMemoryHistory();
            history.push("/somewhere/i/dont/care/yet");

            const underTest = reactTest.render(
                <Router history={history}>
                    <LoginView searchString={"?some=searchString"}/>
                </Router>
            );

            await reactTest.wait(() => expect(history.location.pathname).toStrictEqual("/some/mystical/place"));
        });
    });

    describe("User login denied", () => {
        it("should print an error for a few seconds and then redirect the user to home", async () => {
            LoginService.loginBySearchString = jest.fn().mockRejectedValue(new Error("Access denied"))

            const history = createMemoryHistory();
            history.push("/somewhere/i/dont/care/yet");

            const underTest = reactTest.render(
                <Router history={history}>
                    <LoginView searchString={"?some=searchString"}/>
                </Router>
            );

            const errorMessage = await reactTest.waitForElement(() => underTest.getByText("Error while trying to log you in. Reason: Access denied"));
            expect(errorMessage).toBeVisible();
        });
    });
});
