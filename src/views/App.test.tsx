import React from 'react';
import App from './App';
import {MemoryRouter} from 'react-router-dom'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {DayViewProps} from "./DayView";

jest.mock("./DayView", () => (props: DayViewProps): React.ReactNode => <div>{props.day}</div>);

describe("App", () => {
    it("should render a day view with a property set to the according path", async () => {
        const wrapper = render(
            <MemoryRouter initialEntries={['/days/morgen']}>
                <App/>
            </MemoryRouter>
        );

        expect(wrapper.getByText("morgen")).toBeVisible();
    });
});
