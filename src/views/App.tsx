import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import LoginView from "./LoginView";
import HeaderView from "./HeaderView";
import DevModeView from "./__spikes__/DevModeView";
import SettingsView from "./SettingsView";

export default function App() {
    return (<>
            <HeaderView/>
            <DevModeView/>
            <main>
                <Route render={globalRouteProps => {
                    globalRouteProps.history.listen(() => window.location.reload());
                    return <Switch>
                        <Route exact path="/login/:provider"
                               render={loginRoutProps => <LoginView searchString={loginRoutProps.location.search}/>}/>
                        <Route exact path="/">
                            <Redirect to={"/days"}/>
                        </Route>
                        <Route exact path="/days">
                            <Redirect to={"/days/today"}/>
                        </Route>
                        <Route exact path="/days/today">
                            <DayView day={new Date()}/>
                        </Route>
                        <Route exact path="/days/:day" render={dayRouteProps =>
                            moment(dayRouteProps.match.params.day).isValid() ?
                                <DayView day={moment(dayRouteProps.match.params.day).toDate()}/> :
                                <NotFoundView location={dayRouteProps.location.pathname}/>}/>
                        <Route exact path="/settings">
                            <SettingsView/>
                        </Route>
                        <Route render={routeProps =>
                            <NotFoundView location={routeProps.location.pathname}/>
                        }/>
                    </Switch>
                }}>

                </Route>
            </main>
        </>
    );
}

