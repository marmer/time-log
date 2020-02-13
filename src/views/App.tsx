import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import {UserView} from "./UserView";

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string
}

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

function LoginView(props: { searchString: string }) {

    const [userInfo, setUserInfo] = React.useState<GoogleUserInfo>();

    const oAuthObjectFromSearchString = getOAuthObjectFromSearchString(props.searchString);


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

    const div = <div>
        <label>oAuthObject
            <p>{JSON.stringify(oAuthObjectFromSearchString)}</p>
        </label>
        <label>userString
            <p>{JSON.stringify(userInfo)}</p>
        </label>
    </div>;
    return div;
}

export default function App() {

    return (
        <main>
            <UserView/>

            <Route render={props => {
                props.history.listen(() => window.location.reload());
                return <Switch>
                    <Route path="/login/google"
                           render={routeProps => <LoginView searchString={routeProps.location.search}/>}/>
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

