import GoogleUserInfoCrudService from "./GoogleUserInfoCrudService";
import fetchMock from "fetch-mock";

describe("GoogleUserInfoCrudService", () => {

    beforeEach(() => {
        fetchMock.reset();
        jest.resetAllMocks();
    });

    describe("getUserInfo", () => {
        describe("server responds successful", () => {
            it("should resolve with an appropriate value", async () => {
                const accessToken = "someToken";

                fetchMock.mock({
                    url: "https://www.googleapis.com/oauth2/v2/userinfo",
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + accessToken
                    }
                }, {
                    status: 200,
                    body: "{\n  \"id\": \"someId\",\n  \"email\": \"some@mail\",\n  \"verified_email\": true,\n  \"picture\": \"http://some.url\"\n}"
                });

                await expect(GoogleUserInfoCrudService.getUserInfo(accessToken)).resolves.toStrictEqual({email: "some@mail"});
            });
        });

        describe("response with wrong status code", () => {
            it("should reject with an appropriate error message", async () => {
                const accessToken = "someToken";

                fetchMock.mock({
                    url: "https://www.googleapis.com/oauth2/v2/userinfo",
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + accessToken
                    }
                }, {
                    status: 401,
                    body: "{\n  \"id\": \"someId\",\n  \"email\": \"some@mail\",\n  \"verified_email\": true,\n  \"picture\": \"http://some.url\"\n}"
                });

                await expect(GoogleUserInfoCrudService.getUserInfo(accessToken)).rejects.toStrictEqual(new Error("Cannot get user infos. Request for User infos end with status code 401"));
            });
        });

    });
});
