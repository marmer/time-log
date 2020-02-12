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

    // https://accounts.google.com/o/oauth2/v2/auth
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
                scope: "email",
                metadata: "weeeehah"
            });

// Give it to the provider
            var uri = google.requestToken(request);

// Later we need to check if the response was expected
// so save the request
            google.remember(request);

// Do the redirect
            window.location.href = uri;
        }}>login with google
        </button>
    </div>)
}

// TODO: marmer 12.02.2020 Do something
const sampleLoginValue = {
    "state": "7bfd33b1-1e8a-4b56-8744-aa93ef8c801f",
    "access_token": "ya29.Il-9B-LkMfKs5R3jLdhMxTSr0H1UnmazevMi0puP3-msjecc3cD4efmcow7VAPOyh83_ReeH66gJ313BKN28CQitw_z6ghxkFB1pmU_szVo2vhm7x-ml7Szvml5lUhDXwg",
    "token_type": "Bearer",
    "expires_in": "3599",
    "scope": "email https://www.googleapis.com/auth/userinfo.email openid",
    "authuser": "1",
    "prompt": "consent",
    "session_state": "d059388d1c75467a1522f78af62b8120526a9186..08d6"
};

function getOAuthObjectFromSearchString(searchString: string) {
    return JSON.parse(decodeURI(searchString.replace(/^\?/, "")));
}

export default class App extends React.Component {
    render() {
        return (
            <main>
                <LoginSpike/>
                <Route render={props => {
                    props.history.listen(() => window.location.reload());
                    return <Switch>
                        <Route path="/login/google" render={routeProps => {
                            const searchString = routeProps.location.search;
                            return <div>
                                {JSON.stringify(getOAuthObjectFromSearchString(searchString))}
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
}

