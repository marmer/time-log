import HeaderView from "./HeaderView";
import * as reactTest from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from "react";

jest.mock("./UserView", () => (): React.ReactNode => <div>UserView</div>);

describe("HeaderView", () => {
    it("should show the project name somewhere", async () => {
        const underTest = reactTest.render(<HeaderView/>);

        expect(underTest.getByText("time-log")).toBeVisible()
    });

});
