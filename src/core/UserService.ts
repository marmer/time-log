const OAuth = require('@zalando/oauth2-client-js');

export interface User {
    email: string;
}

export default class UserService {
    static getCurrentUser(): User | null {
        // TODO: marmer 13.02.2020 currently just a spike
        return null;
    }

    static getMissingEnvironmentVariables(): string[] {
        // TODO: marmer 13.02.2020 currently just a spike
        const result: string[] = [];

        if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
            result.push("REACT_APP_OAUTH_CLIENT_ID");

        if (!process.env.REACT_APP_OAUTH_CLIENT_SECRET)
            result.push("REACT_APP_OAUTH_CLIENT_SECRET");

        if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
            result.push("REACT_APP_OAUTH_REDIRECT_URL");

        return result;
    }

    static performLogin() {
        // TODO: marmer 13.02.2020 currently just a spike
        const google = new OAuth.Provider({
            id: 'google',   // required
            authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth' // required,
        });
        const request = new OAuth.Request({
            client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,  // required
            redirect_uri: process.env.REACT_APP_OAUTH_REDIRECT_URL,
            scope: "email https://www.googleapis.com/auth/drive.file",
        });

        const uri = google.requestToken(request);
        google.remember(request);
        window.location.href = uri
    }
}
