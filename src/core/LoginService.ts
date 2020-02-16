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

const getOAuthObjectFromSearchString = (searchString: string): GoogleOAuthResponse => JSON.parse(decodeURI(searchString.replace(/^\?/, "")));

export default class LoginService {

    static async loginBySearchString(searchString: string): Promise<LoginResult> {
        const oauthResponse: GoogleOAuthResponse = SearchStringService.parse(searchString);

        const userInfo = await GoogleUserInfoCrudService.getUserInfo(oauthResponse.access_token);
        UserService.setCurrentuser(userInfo);

        return {
            sourceUrl: oauthResponse.state ?
                oauthResponse.state :
                "/"
        };
        //
        // const [userInfo, setUserInfo] = React.useState<GoogleUserInfo>();
        //
        // const oAuthObjectFromSearchString = getOAuthObjectFromSearchString(searchString);
        //
        // if (!userInfo)
        //     fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        //         method: "GET",
        //         headers: {
        //             "Accept": "application/json",
        //             "Authorization": "Bearer " + oAuthObjectFromSearchString.access_token
        //         }
        //     }).then((response) => {
        //         if (response.status !== 200) {
        //             throw new Error("Unexpected response status: " + response.status);
        //         }
        //         return response.json();
        //     }).then((value: GoogleUserInfo) => setUserInfo(value));

    }


}
