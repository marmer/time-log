export interface GoogleUserInfo {
    email: string;
}

export interface GoogleUserDto {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string
}

export default class GoogleUserInfoCrudService {

    static async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        return fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        })
            .then(response => {
                if (response.status !== 200)
                    throw new Error("Cannot get user infos. Request for User infos end with status code " + response.status);
                return response.json();
            })
            .then((dto: GoogleUserDto) => ({
                email: dto.email
            }));
    }
}
