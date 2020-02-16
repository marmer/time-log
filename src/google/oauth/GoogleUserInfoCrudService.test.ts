import GoogleUserInfoCrudService from "./GoogleUserInfoCrudService";
import fetchMock from "fetch-mock";

describe("GoogleUserInfoCrudService", () => {
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
                    body: "{\n  \"id\": \"someId\",\n  \"email\": \"some@mail\",\n  \"verified_email\": true,\n  \"picture\": \"http://some.url\"\n}"
                });

                await expect(GoogleUserInfoCrudService.getUserInfo(accessToken)).resolves.toStrictEqual({email: "some@mail"});
            });
        });

        // TODO: marmer 16.02.2020 bad status code

    });
});
