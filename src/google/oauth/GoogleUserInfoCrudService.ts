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
            .then(response => response.json())
            .then((dto: GoogleUserDto) => ({email: dto.email} as GoogleUserInfo))


        // .the
        //
        // response.json()
        //
        // .then((response) => {
        // if (response.status !== 200) {
        //     throw new Error("Unexpected response status: " + response.status);
        // }
        // return response.json();
        // });
        //
        // response.
    }
}
