import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DayView from "./DayView";
import NotFoundView from "./NotFoundView";
import moment from "moment";

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
                    <Route exact path="/days/today">
                        <DayView day={new Date()}/>
                    </Route>
                    <Route exact path="/days/:day" render={routeProps =>
                        moment(routeProps.match.params.day).isValid() ?
                            <DayView day={moment(routeProps.match.params.day).toDate()}/> :
                            <Route component={NotFoundView}/>}/>
                    <Route component={NotFoundView}/>
                </Switch>
            </div>
        );
    }
}

