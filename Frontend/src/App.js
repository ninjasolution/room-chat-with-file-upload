import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Admin from "layouts/Admin.js";
import Login from "views/Auth/Login";
import User from "layouts/User";


export default function App(props) {
    return (
        <Switch>
          <Route path="/admin/module/:client" render = { props => <Admin {...props}/> } />
          <Route path="/user/module/:client"  render = { props => <User {...props}/> } />
          <Route path="/login"  render = { props => <Login {...props}/> } />
          <Redirect from="/" to="/login" />
        </Switch>
    )
}
