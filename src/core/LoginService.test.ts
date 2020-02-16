import LoginService, {GoogleOAuthSuccessResponse, LoginResult} from "./LoginService";
import fetchMock from "fetch-mock";
import UserService, {User} from "./UserService";
import SearchStringService from "./SearchStringService";
import GoogleUserInfoCrudService, {GoogleUserInfo} from "../google/oauth/GoogleUserInfoCrudService";

const googleOAuthSuccessResponseBase: GoogleOAuthSuccessResponse = {
    access_token: "access_token",
    expires_in: "expires",
    state: "/some/where",
    token_type: "Bearer"
};

describe("LoginService", () => {
    beforeEach(() => {
        fetchMock.reset();
        jest.resetAllMocks();
    });

    describe("LoginBySearchString", () => {

        describe("valid search string", () => {
            describe("success search string", () => {
                describe("valid response", () => {
                    it("should store the relevant user information and return the state from the oauth response as sourceURL", async () => {
                        UserService.setUser = jest.fn();
                        SearchStringService.parse = jest.fn().mockReturnValue({...googleOAuthSuccessResponseBase});
                        GoogleUserInfoCrudService.getUserInfo = jest.fn().mockResolvedValue({email: "some@one.there"} as GoogleUserInfo);

                        const result = await LoginService.loginBySearchString("someSearchString");

                        expect(SearchStringService.parse).toBeCalledWith("someSearchString");
                        expect(UserService.setUser).toBeCalledWith({
                            email: "some@one.there",
                        } as User);
                        expect(GoogleUserInfoCrudService.getUserInfo).toBeCalledWith(googleOAuthSuccessResponseBase.access_token);
                        expect(result).toStrictEqual({sourceUrl: googleOAuthSuccessResponseBase.state} as LoginResult);
                    });

                    it("should return home as default sourceUrl if no state is set", async () => {
                        UserService.setUser = jest.fn();
                        SearchStringService.parse = jest.fn().mockReturnValue({
                            ...googleOAuthSuccessResponseBase,
                            state: undefined
                        } as GoogleOAuthSuccessResponse);
                        GoogleUserInfoCrudService.getUserInfo = jest.fn().mockResolvedValue({email: "some@one.there"} as GoogleUserInfo);

                        const result = await LoginService.loginBySearchString("someSearchString");

                        expect(result).toStrictEqual({sourceUrl: "/"} as LoginResult);
                    });

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
