import UserService, {User} from "./UserService";
import WindowService from "./WindowService";
import UserRepository from "../local/UserRepository";

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

const userBase = {email: "albert@einstein.de"} as User;
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
        describe("missing environment variables", () => {
            it("should try to redirect with an incomplete url", async () => {
                delete process.env.REACT_APP_OAUTH_CLIENT_ID;
                delete process.env.REACT_APP_OAUTH_REDIRECT_URL;
                delete process.env.REACT_APP_OAUTH_AUTHORIZATION_URL;

                WindowService.redirectTo = jest.fn();

                UserService.performLogin();

                expect(WindowService.redirectTo).toBeCalledWith("?" +
                    "scope=email&" +
                    "include_granted_scopes=true&" +
                    "response_type=token&" +
                    "state=/&" +
                    "redirect_uri=&" +
                    "client_id=");
            });
        });
    });

    describe("getMissingEnvironmentVariables", () => {
        describe("all variables are set", () => {
            it("should return an empty list of thoose variable names", async () => {
                process.env.REACT_APP_OAUTH_CLIENT_ID = "oAuthClientId";
                process.env.REACT_APP_OAUTH_REDIRECT_URL = "oauthRedirectUrl";
                process.env.REACT_APP_OAUTH_AUTHORIZATION_URL = "oauthAuthorizationUrl";

                const result = UserService.getMissingEnvironmentVariables();

                expect(result).toStrictEqual([]);
            });

        });


        describe("variables missing", () => {

            let variableNames = ["REACT_APP_OAUTH_CLIENT_ID", "REACT_APP_OAUTH_REDIRECT_URL", "REACT_APP_OAUTH_AUTHORIZATION_URL"];

            variableNames.forEach(variableName => {
                it("should print it " + variableName + " if it's missing", async () => {
                    process.env.REACT_APP_OAUTH_CLIENT_ID = "oauthCientId";
                    process.env.REACT_APP_OAUTH_REDIRECT_URL = "oauthRedirectUrl";
                    process.env.REACT_APP_OAUTH_AUTHORIZATION_URL = "oauthAuthorizationUrl";

                    delete process.env[variableName];

                    const result = UserService.getMissingEnvironmentVariables();

                    expect(result).toEqual([variableName]);
                })
            });

            it("should print all missing variables if all variables are missing", async () => {
                variableNames.forEach(variableName => delete process.env[variableName]);

                const result = UserService.getMissingEnvironmentVariables();

                variableNames.forEach(variableName => expect(result).toContain(variableName));
                expect(result).toHaveLength(variableNames.length);
            })

        });
    });

    describe("getCurrentUser", () => {
        describe("a user exists", () => {
            it("should return the user", async () => {
                UserRepository.getCurrentUser = jest.fn().mockReturnValue({...userBase});
                const result = UserService.getCurrentUser();
                expect(result).toStrictEqual(userBase);
            });
        });

        describe("no user exists", () => {
            it("should return nothing", async () => {
                UserRepository.getCurrentUser = jest.fn().mockReturnValue(null);
                const result = UserService.getCurrentUser();
                expect(result).toStrictEqual(null);
            });
        });
    });

    describe("setCurrentuser", () => {
        it("should store the user if called", async () => {
            UserRepository.setCurrentUser = jest.fn();

            UserService.setCurrentuser({...userBase});

            expect(UserRepository.setCurrentUser).toBeCalledWith(userBase);
        });
    });
});
