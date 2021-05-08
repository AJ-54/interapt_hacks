import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Admin from "layouts/Admin.js";
import Home from "layouts/Home";

import "assets/css/material-dashboard-react.css?v=1.10.0";
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/admin" component={Admin} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
