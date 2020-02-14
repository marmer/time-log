import UserService from "./UserService";
import WindowService from "./WindowService";

type KeyValuePairs = { [key: string]: string | undefined; };

const originalEnvironmentVariables: KeyValuePairs = {};

const storeCustomEnvironmentVariables = () => {
    Object.keys(process.env)
        .filter(key => key.startsWith("REACT_APP"))
        .forEach(key => originalEnvironmentVariables[key] = process.env[key])
};

const resetCustomEnvironmentVariables = () => {
    Object.keys(originalEnvironmentVariables)
        .forEach(key => process.env[key] = originalEnvironmentVariables[key]);
};

describe("UserService", () => {

    beforeEach(() => {
        storeCustomEnvironmentVariables();
    });

    afterEach(() => {
        resetCustomEnvironmentVariables();
    });

    describe("performLogin", () => {
        describe("all environment variables set", () => {
            it("should redirect to google with all the necessary values", async () => {
                let authauthorizationUrl = "oauthAuthorizationUrl";
                let oAuthRedirectUrl = "oauthRedirectUrl";
                let oAuthClientId = "oAuthClientId";

                process.env.REACT_APP_OAUTH_CLIENT_ID = oAuthClientId;
                process.env.REACT_APP_OAUTH_REDIRECT_URL = oAuthRedirectUrl;
                process.env.REACT_APP_OAUTH_AUTHORIZATION_URL = authauthorizationUrl;

                WindowService.redirectTo = jest.fn();

                UserService.performLogin();

                expect(WindowService.redirectTo).toBeCalledWith(authauthorizationUrl + "?" +
                    "scope=email&" +
                    "include_granted_scopes=true&" +
                    "response_type=token&" +
                    "state=/&" +
                    "redirect_uri=" + oAuthRedirectUrl + "&" +
                    "client_id=" + oAuthClientId);
            });
        });
    });
});
