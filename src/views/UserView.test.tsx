import UserView from "./UserView";
import * as reactTest from "@testing-library/react"
import React from "react";
import UserService from "../core/UserService";

describe("UserView", () => {
    it("should show an error when some important environment variables are not set", async () => {
        const missingEnvironmentVariables = ["SOME_ENVIRONMENT_VARIABLE", "ANOTHER_MISSING_ENVIRONMENT_VARIABLE"];
        UserService.getMissingEnvironmentVariables = jest.fn().mockReturnValue(missingEnvironmentVariables);

        const underTest = reactTest.render(<UserView/>);

        const container = underTest.getByText("Server Missconfiguration. Set the following environment variables are not set properly:").closest("div");
        missingEnvironmentVariables.forEach(envVar => reactTest.within(container as any).getByText(envVar));
    });
});
