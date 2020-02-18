import RemoteLoginService, {GoogleOAuthSuccessResponse, LoginResult} from "./RemoteLoginService";
import fetchMock from "fetch-mock";
import UserService, {User} from "./UserService";
import SearchStringService from "./SearchStringService";
import GoogleUserInfoCrudService, {GoogleUserInfo} from "../google/oauth/GoogleUserInfoCrudService";

const googleOAuthSuccessResponseBase: GoogleOAuthSuccessResponse = {
    access_token: "1337_access",
    expires_in: "42",
    state: "/some/where",
    token_type: "Bearer"
};

const userBase: User = {
    accessToken: "someToken",
    email: "someMail"
};
describe("RemoteLoginService", () => {
    beforeEach(() => {
        fetchMock.reset();
        jest.resetAllMocks();
    });

    describe("LoginBySearchString", () => {

        describe("valid search string", () => {
            describe("success search string", () => {
                describe("valid response", () => {
                    it("should store the relevant user information and return the state from the oauth response as sourceURL", async () => {
                        UserService.setCurrentuser = jest.fn();
                        SearchStringService.parse = jest.fn().mockReturnValue({...googleOAuthSuccessResponseBase});
                        GoogleUserInfoCrudService.getUserInfo = jest.fn().mockResolvedValue({email: "some@one.there"} as GoogleUserInfo);

                        const result = await RemoteLoginService.loginBySearchString("someSearchString");

                        expect(SearchStringService.parse).toBeCalledWith("someSearchString");
                        expect(UserService.setCurrentuser).toBeCalledWith({
                            email: "some@one.there",
                            accessToken: googleOAuthSuccessResponseBase.access_token
                        } as User);
                        expect(GoogleUserInfoCrudService.getUserInfo).toBeCalledWith(googleOAuthSuccessResponseBase.access_token);
                        expect(result).toStrictEqual({sourceUrl: googleOAuthSuccessResponseBase.state} as LoginResult);
                    });

                    it("should return home as default sourceUrl if no state is set", async () => {
                        UserService.setCurrentuser = jest.fn();
                        SearchStringService.parse = jest.fn().mockReturnValue({
                            ...googleOAuthSuccessResponseBase,
                            state: undefined
                        } as GoogleOAuthSuccessResponse);
                        GoogleUserInfoCrudService.getUserInfo = jest.fn().mockResolvedValue({email: "some@one.there"} as GoogleUserInfo);

                        const result = await RemoteLoginService.loginBySearchString("someSearchString");

                        expect(result).toStrictEqual({sourceUrl: "/"} as LoginResult);
                    });

                });
                describe("error response", () => {
                    it("should reject with an appropriate error message", async () => {
                        UserService.setCurrentuser = jest.fn();
                        SearchStringService.parse = jest.fn().mockReturnValue({
                            ...googleOAuthSuccessResponseBase,
                            state: undefined
                        } as GoogleOAuthSuccessResponse);
                        GoogleUserInfoCrudService.getUserInfo = jest.fn().mockRejectedValue(new Error("Error while loading user infos."));

                        await expect(RemoteLoginService.loginBySearchString("someSearchString")).rejects.toStrictEqual(new Error("Not able to login the user. Reason: Error while loading user infos."));
                    });
                });
            });
        });
    });

    describe("logout", () => {
        it("should logout a currently logged in user", async () => {
            UserService.getCurrentUser = jest.fn().mockReturnValue({...userBase});

            fetchMock.mock("https://oauth2.googleapis.com/revoke?token=" + userBase.accessToken, 200);

            RemoteLoginService.logout();

            expect(fetchMock.called("https://oauth2.googleapis.com/revoke?token=" + userBase.accessToken, {
                method: "GET",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            })).toBeTruthy();

        });

        it("should not try to logout a user if no user is logged in", async () => {
            UserService.getCurrentUser = jest.fn().mockReturnValue(null);

            fetchMock.mock("https://oauth2.googleapis.com/revoke?token=" + userBase.accessToken, 200);

            RemoteLoginService.logout();

            expect(fetchMock.called("https://oauth2.googleapis.com/revoke?token=" + userBase.accessToken, {
                method: "GET",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            })).toBeFalsy();
        });
    });
});
