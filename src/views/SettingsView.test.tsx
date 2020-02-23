import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import * as reactTest from "@testing-library/react";

import SettingsView from "./SettingsView";
import SettingsService from "../core/SettingsService";

describe("SettingsView", () => {

    it("should show some loading state while loading the settings", async () => {
        SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue({expectedDailyTimelogInMinutes: 480});

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        expect(dailyTimelogField).toBeDisabled();
        expect(dailyTimelogField).toHaveValue("Loading...");
        expect(underTest.getByTitle("save")).toBeDisabled()
    });

    it("should show tie current expected daily time to log after loading", async () => {
        SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue(480);

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        console.log(reactTest.prettyDOM(dailyTimelogField));
        await reactTest.waitForDomChange({container: dailyTimelogField});
        console.log(reactTest.prettyDOM(dailyTimelogField));
        expect(dailyTimelogField).toBeEnabled();
        expect(dailyTimelogField).toHaveValue("8h");
        expect(underTest.getByTitle("save")).toBeEnabled()
    });
    // TODO: marmer 23.02.2020 save
    // TODO: marmer 23.02.2020 invalid values
    // TODO: marmer 23.02.2020 Errorhandling while loading
});
