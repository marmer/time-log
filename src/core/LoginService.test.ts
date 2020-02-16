import LoginService from "./LoginService";
import fetchMock from "fetch-mock";

describe("LoginService", () => {
    beforeEach(() => {
        fetchMock.reset();
        jest.resetAllMocks();
    });

    describe("LoginBySearchString", () => {

        describe("valid search string", () => {
            describe("success search string", () => {

                describe("valid response", () => {
                    // TODO: marmer 16.02.2020
                });
                describe("error response", () => {
                    // TODO: marmer 16.02.2020
                });
            });
            describe("error search string", () => {
                // TODO: marmer 16.02.2020
            });
        });
        describe("invalid search string", () => {
            // TODO: marmer 16.02.2020
        });
    });
});
