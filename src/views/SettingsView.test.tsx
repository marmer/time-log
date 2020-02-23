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
        expect(dailyTimelogField).toHaveProperty("placeholder", "loading...");
        expect(underTest.getByTitle("save")).toBeDisabled()
    });

    it("should show tie current expected daily time to log after loading", async () => {
        SettingsService.getExpectedDailyTimelogInMinutes = jest.fn().mockResolvedValue({expectedDailyTimelogInMinutes: 480});

        const underTest = reactTest.render(<SettingsView/>);
        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        await reactTest.waitForDomChange({container: dailyTimelogField});
        expect(dailyTimelogField).toBeEnabled();
        expect(dailyTimelogField).toHaveValue("8h");
        expect(underTest.getByTitle("save")).toBeEnabled()
    });
});
