import UserView from "./UserView";
import * as reactTest from "@testing-library/react"
import React from "react";
import UserService, {User} from "../core/UserService";
import userEvent from "@testing-library/user-event";

const baseUser = {email: "some@mail.de"} as User;

describe("UserView", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("presentation", () => {
        it("should show an error when some important environment variables are not set", async () => {
            const missingEnvironmentVariables = ["SOME_ENVIRONMENT_VARIABLE", "ANOTHER_MISSING_ENVIRONMENT_VARIABLE"];
            UserService.getMissingEnvironmentVariables = jest.fn().mockReturnValue(missingEnvironmentVariables);

            const underTest = reactTest.render(<UserView/>);

            const container = underTest.getByText("Server Missconfiguration. Set the following environment variables are not set properly:").closest("div");
            missingEnvironmentVariables.forEach(envVar => reactTest.within(container as any).getByText(envVar));
        });

        it("should show a login button if no user is currently logged in", async () => {
            UserService.getCurrentUser = jest.fn().mockReturnValue(null);

            const underTest = reactTest.render(<UserView/>);

            expect(underTest.getByText("Login")).toBeVisible();
        });

        it("should show the users email if a user is logged in", async () => {
            UserService.getCurrentUser = jest.fn().mockReturnValue({...baseUser});

            const underTest = reactTest.render(<UserView/>);

            expect(underTest.getByText(baseUser.email)).toBeVisible();

        });

        it("should show a logout button if the user is logged in", async () => {
            UserService.getCurrentUser = jest.fn().mockReturnValue({...baseUser});

            const underTest = reactTest.render(<UserView/>);

            expect(underTest.getByText("Logout")).toBeVisible();
        });
    });

    describe("functionality", () => {
        it("should trigger the login process if the login button is triggered", async () => {
            UserService.redirectToLogin = jest.fn();
            UserService.getCurrentUser = jest.fn().mockReturnValue(null);

            const underTest = reactTest.render(<UserView/>);

            userEvent.click(underTest.getByText("Login"));

            expect(UserService.redirectToLogin).toBeCalled();
        });
    });
});
