import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";

export default class App extends React.Component {
    render() {
        return (
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={"/days"}/>
                        </Route>
                        <Route exact path="/days">
                            <Redirect to={"/days/heute"}/>
                        </Route>
                        <Route exact path="/days/:day" render={routeProps => {
                            return <DayView day={routeProps.match.params.day}/>
                        }}/>
                        <Route>
                            <h1>Who told you about this location?</h1>
                        </Route>
                    </Switch>
                </div>
        );
    }
}

