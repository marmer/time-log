import React from "react";

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string
}

interface GoogleOSuccessResponse {
    state?: string;
    access_token: string;
    token_type: "Bearer" | string;
    expires_in: string; // seconds
}

interface GoogleOAuthErrorResponse {
    error: string;
}

interface GoogleOResponse extends GoogleOSuccessResponse, GoogleOAuthErrorResponse {
}

const getOAuthObjectFromSearchString = (searchString: string): GoogleOResponse => JSON.parse(decodeURI(searchString.replace(/^\?/, "")));

export interface LoginViewProps {
    searchString: string;
}

export default (props: LoginViewProps) => {


    const [userInfo, setUserInfo] = React.useState<GoogleUserInfo>();

    const oAuthObjectFromSearchString = getOAuthObjectFromSearchString(props.searchString);

    if (!userInfo)
        fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + oAuthObjectFromSearchString.access_token
            }
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error("Unexpected response status: " + response.status);
            }
            return response.json();
        }).then((value: GoogleUserInfo) => setUserInfo(value));

    return <div>
        <label>oAuthObject
            <p>{JSON.stringify(oAuthObjectFromSearchString)}</p>
        </label>
        <label>userString
            <p>{JSON.stringify(userInfo)}</p>
        </label>
    </div>;
};
