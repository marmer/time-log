import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import {UserView} from "./UserView";
import {LoginView} from "./LoginView";

export default function App() {
    return (
        <main>
            <UserView/>

            <Route render={props => {
                props.history.listen(() => window.location.reload());
                return <Switch>
                    <Route exact path="/login/*"
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

