import React from "react";

const OAuth = require('@zalando/oauth2-client-js');

export default () => {
    const google = new OAuth.Provider({
        id: 'google',   // required
        authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth' // required,
    });

    // https://www.npmjs.com/package/@zalando/oauth2-client-js
    if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_ID</div>;
    if (!process.env.REACT_APP_OAUTH_CLIENT_SECRET)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_SECRET</div>;
    if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_REDIRECT_URL</div>;


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
