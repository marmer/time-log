import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import * as reactTest from "@testing-library/react";

import SettingsView from "./SettingsView";
import DailyTimeLogSettingsService, {DailyTimelogSettings} from "../core/DailyTimeLogSettingsService";
import userEvent from "@testing-library/user-event";
import deepmerge from "deepmerge";

const dailyTimelogSettingsBase: DailyTimelogSettings = {
    expectedDailyTimelogInMinutes: 480,
    expectedTimelogDays: {
        sunday: false,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false
    }
};
describe("SettingsView", () => {
    it("should show some loading state while loading the settings", async () => {
        DailyTimeLogSettingsService.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(
            dailyTimelogSettingsBase
        );

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        expect(dailyTimelogField).toBeDisabled();
        expect(dailyTimelogField).toHaveValue("Loading...");
        expect(underTest.getByTitle("save")).toBeDisabled()
    });

    it("should show the current expected daily time to log after loading", async () => {
        DailyTimeLogSettingsService.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(
            deepmerge(dailyTimelogSettingsBase, {expectedDailyTimelogInMinutes: 480})
        );

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        await reactTest.waitForDomChange({container: dailyTimelogField});
        expect(dailyTimelogField).toBeEnabled();
        expect(dailyTimelogField).toHaveValue("8h");
        expect(underTest.getByTitle("save")).toBeEnabled()
    });

    it("should show tie current expected daily time to log after loading", async () => {
        DailyTimeLogSettingsService.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(
            deepmerge(dailyTimelogSettingsBase, {expectedDailyTimelogInMinutes: 480})
        );
        DailyTimeLogSettingsService.setExpectedDailyTimelogSettings = jest.fn();

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        await reactTest.waitForDomChange({container: dailyTimelogField});
        userEvent.type(dailyTimelogField, "15m");
        userEvent.click(underTest.getByTitle("save"));

        expect(DailyTimeLogSettingsService.setExpectedDailyTimelogSettings).toBeCalledWith(
            deepmerge(dailyTimelogSettingsBase, {expectedDailyTimelogInMinutes: 15}));
    });

    it("should mark invalid values and make saving of that invalid value impossible", async () => {
        DailyTimeLogSettingsService.getExpectedDailyTimelogSettings = jest.fn().mockResolvedValue(
            deepmerge(dailyTimelogSettingsBase, {expectedDailyTimelogInMinutes: 480}));
        DailyTimeLogSettingsService.setExpectedDailyTimelogSettings = jest.fn();

        const underTest = reactTest.render(<SettingsView/>);

        const dailyTimelogField = underTest.getByLabelText("Expected Time to log per day");
        await reactTest.waitForDomChange({container: dailyTimelogField});
        userEvent.type(dailyTimelogField, "something invalid");
        expect(dailyTimelogField.classList).toContain("invalid-format");
        expect(underTest.getByTitle("save")).toBeDisabled();
    });
    // TODO: marmer 23.02.2020 Errorhandling while loading
});
