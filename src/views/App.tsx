import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import DayView from "./DayView";

export default function App() {

    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <DayView day="today"/>
                    </Route>
                    <Route exact path="/:day">
                        <DayView day="today"/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

