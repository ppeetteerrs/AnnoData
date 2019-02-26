import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { TasksListPage } from "../pages/tasksList/tasksList";
import { Identification } from '../pages/taskPage/identification/identification';

export class RouteComponent extends Component {
    render() {
        return <Router>
            <Switch>
                <Route path="/" component={TasksListPage} />
                <Route path="/identificaiton" component={Identification} />
            </Switch>
        </Router>
    }
}