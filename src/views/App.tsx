import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSpike = () => {


    https://accounts.google.com/o/oauth2/v2/auth

        if (!process.env.REACT_APP_OAUTH_CLIENT_ID)
            return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_ID</div>
    if (!process.env.REACT_APP_OAUTH_CLIENT_SECRET)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_CLIENT_SECRET</div>
    if (!process.env.REACT_APP_OAUTH_REDIRECT_URL)
        return <div>Server Missconfiguration ... Environment Variable not set: REACT_APP_OAUTH_REDIRECT_URL</div>


    return (<div><p>This yould be a login</p>
        <p>{process.env.REACT_APP_OAUTH_CLIENT_ID}</p>
        <p>{process.env.REACT_APP_OAUTH_CLIENT_SECRET}</p>
        <p>{process.env.REACT_APP_OAUTH_REDIRECT_URL}</p>
    </div>)
}

export default class App extends React.Component {
    render() {
        return (
            <main>
                <LoginSpike/>

                <Route render={props => {
                    props.history.listen(() => window.location.reload());
                    return <Switch>
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
                        <Route render={routeProps => <NotFoundView location={routeProps.location.pathname}/>}/>
                    </Switch>
                }}>

                </Route>
            </main>
        );
    }
}

