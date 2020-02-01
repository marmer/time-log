import React from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={"/heute"}/>
                        </Route>
                        <Route exact path="/:day" render={routeProps => {
                            return <DayView day={routeProps.match.params.day}/>
                        }}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

