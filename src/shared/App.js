import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { Main, Membership, Landing, Idea } from "../pages/index.js";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Main} />
        <Route exact path="/membership" component={Membership} />
        <Route exact path="/landing" component={Landing} />
        <Route exact path="/idea" component={Idea} />
        <Route exact path="/">
          <Redirect to="/landing" />
        </Route>
      </div>
    );
  }
}

export default App;
