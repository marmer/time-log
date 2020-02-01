import React from 'react';
import App from './App';
import {MemoryRouter} from 'react-router-dom'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe("App", () => {
    it("should render a day view ", async () => {
        const wrapper = render(
            <MemoryRouter initialEntries={['/days/morgen']}>
                <App/>
            </MemoryRouter>
        );

        expect(wrapper.getByText("morgen")).toBeVisible();
    });
});
