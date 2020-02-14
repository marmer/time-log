import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginView from "./LoginView";
import HeaderView from "./HeaderView";

export default function App() {
    return (<>
            {/*Spike for environment variables in github pages start */}
            <div>
                {process.env.REACT_APP_SOME_ENV_VAR ? "Yeah, this is the value I wanted to see: " + process.env.REACT_APP_SOME_ENV_VAR : "Oh noooooooooo. I cannot find the variable"}
            </div>
            {/*Spike for environment variables github pages  end */}

            <HeaderView/>
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

