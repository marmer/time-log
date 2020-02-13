import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSpike = () => {
    var OAuth = require('@zalando/oauth2-client-js');
    var google = new OAuth.Provider({
        id: 'google',   // required
        authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth' // required,
    });

    // https://www.npmjs.com/package/@zalando/oauth2-client-js
    if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_ID</div>
    if (!process.env.REACT_APP_OAUTH_CLIENT_SECRET)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_SECRET</div>
    if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_REDIRECT_URL</div>


    return (<div><p>This yould be a login</p>
        <button onClick={() => {
            // Create a new request
            var request = new OAuth.Request({
                client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,  // required
                redirect_uri: process.env.REACT_APP_OAUTH_REDIRECT_URL,
                scope: "email https://www.googleapis.com/auth/drive.file",
            });

// Give it to the provider
            var uri = google.requestToken(request);

// Later we need to check if the response was expected
// so save the request
            google.remember(request);

// Do the redirect
            window.location.href = uri
        }}>login with google
        </button>
    </div>)
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string
}

// TODO: marmer 12.02.2020 Do something
interface GoogleLoginValue {
    state: string;
    access_token: string;
    token_type: "Bearer" | string;
    expires_in: string; // seconds
    scope: string; //e.g. email https://www.googleapis.com/auth/userinfo.email openid
    authuser: string; //numeric string
    prompt: string;
    session_state: string;
};

function getOAuthObjectFromSearchString(searchString: string): GoogleLoginValue {
    return JSON.parse(decodeURI(searchString.replace(/^\?/, "")));
}

export default function App() {

    const [userInfo, setUserInfo] = React.useState<GoogleUserInfo>();

    return (
        <main>
            <LoginSpike/>

            <Route render={props => {
                props.history.listen(() => window.location.reload());
                return <Switch>
                    <Route path="/login/google" render={routeProps => {

                        const searchString = routeProps.location.search;

                        const oAuthObjectFromSearchString = getOAuthObjectFromSearchString(searchString);

                        if (!userInfo)
                            fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                                method: "GET",
                                headers: {
                                    "Accept": "application/json",
                                    "Authorization": "Bearer " + oAuthObjectFromSearchString.access_token
                                }
                            }).then((response) => {
                                if (response.status !== 200) {
                                    throw new Error("Unexpected response status: " + response.status);
                                }
                                return response.json();
                            }).then((value: GoogleUserInfo) => setUserInfo(value));

                        return <div>
                            <label>oAuthObject
                                <p>{JSON.stringify(oAuthObjectFromSearchString)}</p>
                            </label>
                            <label>userString
                                <p>{JSON.stringify(userInfo)}</p>
                            </label>
                        </div>
                    }}/>
                    <Route exact path="/">
                        <Redirect to={"/days"}/>
                    </Route>
                    <Route exact path="/days">
                        <Redirect to={"/days/today"}/>
                    </Route>
                    <Route exact path="/days/today">
                        <DayView day={new Date()}/>
                    </Route>
                    <Route exact path="/days/:day" render={routeProps =>
                        moment(routeProps.match.params.day).isValid() ?
                            <DayView day={moment(routeProps.match.params.day).toDate()}/> :
                            <NotFoundView location={routeProps.location.pathname}/>}/>
                    <Route render={routeProps =>
                        <NotFoundView location={routeProps.location.pathname}/>
                    }/>
                </Switch>
            }}>

            </Route>
        </main>
    );
}

