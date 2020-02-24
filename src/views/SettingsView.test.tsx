import SettingsView from "./SettingsView";
import * as reactTest from "@testing-library/react"
import React from "react";

jest.mock("./DailyTimelogSettingsView", () => () => <div>DailyTimelogSettingsView</div>);

describe("SettingsView", () => {
    it("should render with all components", async () => {
        const underTest = reactTest.render(<SettingsView/>);
        expect(underTest).toMatchSnapshot("SettingsView");
    });
});
