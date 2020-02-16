export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string
}

export default class GoogleUserInfoCrudService {

    static async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        // TODO: marmer 16.02.2020
        return Promise.reject("ya ya ya ya ya ;)");
    }
}
