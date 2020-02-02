import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/">
                        <Redirect to={"/days"}/>
                    </Route>
                    <Route exact path="/days">
                        <Redirect to={"/days/today"}/>
                    </Route>
                    <Route exact path="/days/:day" render={routeProps => {
                        return <DayView day={routeProps.match.params.day}/>
                    }}/>
                    <Route component={NotFoundView}/>
                </Switch>
            </div>
        );
    }
}

