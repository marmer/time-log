import React from "react";
import UserService from "../core/UserService";

const OAuth = require('@zalando/oauth2-client-js');

export default () => {
    const missingEnvironmentVariables = UserService.getMissingEnvironmentVariables();
    if (missingEnvironmentVariables && missingEnvironmentVariables.length) return <section>
        <strong>Server Missconfiguration. Set the following environment variables are not set properly:</strong>
        {missingEnvironmentVariables.map(envVar => <div key={envVar}>{envVar}</div>)}
    </section>;

    const google = new OAuth.Provider({
        id: 'google',   // required
        authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth' // required,
    });


    return (<div><p>This yould be a login</p>
        <button onClick={() => {
            const request = new OAuth.Request({
                client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,  // required
                redirect_uri: process.env.REACT_APP_OAUTH_REDIRECT_URL,
                scope: "email https://www.googleapis.com/auth/drive.file",
            });

            const uri = google.requestToken(request);
            google.remember(request);
            window.location.href = uri
        }}>login with google
        </button>
    </div>)
};
