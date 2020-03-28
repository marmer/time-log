import * as functions from 'firebase-functions';
import * as express from "express";

const unirest = require("unirest");

const app = express();

app.post("/v1/auth/token/google/token/refresh/:refreshToken", async (request, response) => {
    response.set('Access-Control-Allow-Origin', 'https://marmer.github.io');


    const req = unirest("POST", "https://oauth2.googleapis.com/token");

    req.timeout(30000);
    req.query({
        "refresh_token": request.params.refreshToken,
        "client_id": "502499757378-a54o9nthuijpls8ihifb37tltl76tvgj.apps.googleusercontent.com",
        "grant_type": "refresh_token",
        "client_secret": ###set client secret here before deployment ###
    });


    req.end((res: any) => {
        response.status(res.status ? res.status : 500);
        if (!res.body && res.error) {
            response.send(JSON.stringify({
                "error": "unexpected error",
                "error_description": "unexpected error"
            }))
        } else {
            response.send(res.body);
        }
    });
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const timelogapi = functions.https.onRequest(app);
