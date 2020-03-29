import WindowService from "./WindowService";
import UserRepository from "../local/UserRepository";
import SearchStringService from "./SearchStringService";
import RemoteLoginService from "./RemoteLoginService";

export interface User {
    email: string
    accessToken: string
}

export default class UserService {
    static logout() {
        RemoteLoginService.logout();
        UserRepository.removeCurrentUser();
        // TODO: marmer 21.03.2020 remove locally stored data
        WindowService.reload();
    }

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

    static redirectToLogin() {
        const requestProps: { [key: string]: any; } = {
            scope: "email https://www.googleapis.com/auth/drive.file",
            include_granted_scopes: true,
            response_type: "code",
            access_type: "offline",
            state: window.location.origin + "/login/google",
            redirect_uri: process.env.REACT_APP_OAUTH_REDIRECT_URL ? process.env.REACT_APP_OAUTH_REDIRECT_URL : "",
            client_id: process.env.REACT_APP_OAUTH_CLIENT_ID ? process.env.REACT_APP_OAUTH_CLIENT_ID : ""
        };

        const redirectUrl = (process.env.REACT_APP_OAUTH_AUTHORIZATION_URL ? process.env.REACT_APP_OAUTH_AUTHORIZATION_URL : "") +
            SearchStringService.toSearchString(requestProps);

        WindowService.redirectTo(redirectUrl);
    }

    static setCurrentuser(user: User) {
        UserRepository.setCurrentUser(user);
    }
}
