import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  Main,
  Membership,
  Landing,
  Idea,
  Name,
  Title,
  Intro,
  Domain,
  Follow,
} from "../pages/index.js";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Landing} />
        <Route exact path="/membership" component={Membership} />
        <Route exact path="/idea" component={Idea} />
        <Route exact path="/name" component={Name} />
        <Route exact path="/title" component={Title} />
        <Route exact path="/intro" component={Intro} />
        <Route exact path="/domain" component={Domain} />
        <Route exact path="/follow" component={Follow} />
      </div>
    );
  }
}

export default App;
