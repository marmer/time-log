import WindowService from "./WindowService";
import UserRepository from "../local/UserRepository";

export interface User {
    email: string;
}

export default class UserService {
    static getCurrentUser(): User | null {
        return UserRepository.getCurrentUser();
    }

    static getMissingEnvironmentVariables(): string[] {
        const result: string[] = [];

        if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
            result.push("REACT_APP_OAUTH_CLIENT_ID");

        if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
            result.push("REACT_APP_OAUTH_REDIRECT_URL");

        if (!process.env.REACT_APP_OAUTH_AUTHORIZATION_URL)
            result.push("REACT_APP_OAUTH_AUTHORIZATION_URL");

        return result;
    }

    static performLogin() {
        const requestProps: { [key: string]: any; } = {
            scope: encodeURI("email"),
            include_granted_scopes: true,
            response_type: "token",
            state: "/",
            redirect_uri: encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URL ? process.env.REACT_APP_OAUTH_REDIRECT_URL : ""),
            client_id: process.env.REACT_APP_OAUTH_CLIENT_ID ? process.env.REACT_APP_OAUTH_CLIENT_ID : ""
        };

        const redirectUrl = (process.env.REACT_APP_OAUTH_AUTHORIZATION_URL ? process.env.REACT_APP_OAUTH_AUTHORIZATION_URL : "") +
            "?" + Object.keys(requestProps)
                .map((key: string) => {
                    return key + "=" + requestProps[key]
                }).reduce((previousValue, currentValue) =>
                    previousValue ?
                        previousValue + "&" + currentValue :
                        currentValue);

        WindowService.redirectTo(redirectUrl);
    }

    static setUser(user: User) {
// TODO: marmer 16.02.2020
    }
}
