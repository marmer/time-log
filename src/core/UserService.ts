export default class UserService {
    static getMissingEnvironmentVariables(): string[] {
        const result: string[] = [];

        if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
            result.push("REACT_APP_OAUTH_CLIENT_ID");

        if (!process.env.REACT_APP_OAUTH_CLIENT_SECRET)
            result.push("REACT_APP_OAUTH_CLIENT_SECRET");

        if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
            result.push("REACT_APP_OAUTH_REDIRECT_URL");

        return result;
    }

}
