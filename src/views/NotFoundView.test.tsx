import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NotFoundView from "./NotFoundView";

describe("NotFoundView", () => {
    it("should render the location somewhere", async () => {
        const underTest = render(<NotFoundView location="foo/bar"/>);

        expect(underTest.getByText("foo/bar")).toBeVisible()
    });
});
