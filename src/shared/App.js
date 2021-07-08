import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { Main, Membership, Landing, Idea, Name } from "../pages/index.js";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Landing} />
        <Route exact path="/membership" component={Membership} />
        <Route exact path="/idea" component={Idea} />
        <Route exact path="/name" component={Name} />
      </div>
    );
  }
}

export default App;
