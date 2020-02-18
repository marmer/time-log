import SearchStringService from "./SearchStringService";
import GoogleUserInfoCrudService from "../google/oauth/GoogleUserInfoCrudService";
import UserService from "./UserService";

export interface LoginResult {
    sourceUrl: string
}

export interface GoogleOAuthSuccessResponse {
    state?: string;
    access_token: string;
    token_type: "Bearer" | string;
    expires_in: string; // seconds
}

export interface GoogleOAuthErrorResponse {
    error: string;
}

interface GoogleOAuthResponse extends GoogleOAuthSuccessResponse, GoogleOAuthErrorResponse {
}

export default class RemoteLoginService {
    static async logout() {
        const currentUser = UserService.getCurrentUser();
        return currentUser ?
            fetch("https://oauth2.googleapis.com/revoke?token=" + UserService.getCurrentUser()?.accessToken, {
                method: "GET",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            }) :
            Promise.resolve()
    }

    static async loginBySearchString(searchString: string): Promise<LoginResult> {
        const oauthResponse: GoogleOAuthResponse = SearchStringService.parse(searchString);

        return GoogleUserInfoCrudService.getUserInfo(oauthResponse.access_token)
            .then(userInfo => {
                UserService.setCurrentuser({
                    email: userInfo.email,
                    accessToken: oauthResponse.access_token,
                });

                return {
                    sourceUrl: oauthResponse.state ?
                        oauthResponse.state :
                        "/"
                };
            }).catch(error => Promise.reject(new Error("Not able to login the user. Reason: " + error.message)));
    }
}
