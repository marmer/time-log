import * as functions from 'firebase-functions';
import * as express from "express";
import * as bodyParser from "body-parser";

const unirest = require("unirest");

const app = express();
app.use(bodyParser.json());

// TODO: marmer 29.03.2020 Do Not Commit this Secret!!!!!
const clientSecret = set_client_secret_before_deployment;

// TODO: marmer 30.03.2020 cleanup and remove duplications

app.get("/v1/auth/code", (request, response) => {
    response.set('Access-Control-Allow-Origin', 'https://marmer.github.io');

    const query: { state: string, code: string, scope: string, authuser: string, prompt: string, error?: string } = {...request.query};

    const req = unirest("POST", "https://oauth2.googleapis.com/token");

    if (query.error) {
        response.redirect(query.state + toSearchString(query as any))
    }
    if (!query.code) {
        response.redirect("Missing parameter code")
    }

    req.timeout(30000);
    req.query({
        "code": query.code,
        "client_id": "502499757378-a54o9nthuijpls8ihifb37tltl76tvgj.apps.googleusercontent.com",
        "grant_type": "authorization_code",
        "redirect_uri": !query.state || query.state.includes("localhost") ?
            "http://localhost:5001/time-log-e5c6b/us-central1/timelogapi/v1/login" :
            "https://us-central1-time-log-e5c6b.cloudfunctions.net/timelogapi/v1/login",
        "client_secret": clientSecret
    });

    req.headers({
        "content-type": "application/x-www-form-urlencoded"
    });

    req.form({});

    req.end((res: any) => {
        response.status(res.status ? res.status : 500);
        if (!res.body && res.error) {
            response.redirect(query.state + toSearchString({
                ...query,
                error: "unexpected error",
                error_description: "unexpected error"
            }));
        } else {
            response.redirect(query.state + toSearchString({...query, ...res.body}));
        }
    });
});

app.get("/v1/auth/refresh_token", (request, response) => {
    response.set('Access-Control-Allow-Origin', 'https://marmer.github.io');

    const query: { state: string, refresh_token: string, scope: string, authuser: string, prompt: string, error?: string } = {...request.query};

    const req = unirest("POST", "https://oauth2.googleapis.com/token");

    if (query.error) {
        response.redirect(query.state + toSearchString(query as any))
    }
    if (!query.refresh_token) {
        response.redirect("Missing parameter refresh_token")
    }

    req.timeout(30000);
    req.query({
        "refresh_token": query.refresh_token,
        "client_id": "502499757378-a54o9nthuijpls8ihifb37tltl76tvgj.apps.googleusercontent.com",
        "grant_type": "refresh_token",
        "client_secret": clientSecret
    });

    req.headers({
        "content-type": "application/x-www-form-urlencoded"
    });

    req.form({});

    req.end((res: any) => {
        response.status(res.status ? res.status : 500);
        if (!res.body && res.error) {
            response.redirect(query.state + toSearchString({
                ...query,
                error: "unexpected error",
                error_description: "unexpected error"
            }));
        } else {
            response.redirect(query.state + toSearchString({...query, ...res.body}));
        }
    });
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const timelogapi = functions.https.onRequest(app);

const toSearchString = (requestProps: { [p: string]: string | number | boolean }) => {

    if (!Object.keys(requestProps).length)
        return "?";

    return "?" + Object.keys(requestProps)
        .map((key: string) => key + "=" + encodeURIComponent(requestProps[key]))
        .join("&");
};
