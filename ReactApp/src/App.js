import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  withRouter,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";

const Routing = () => {

  return (
    <Router forceRefresh={true}>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <HomePage/>
            )}
          />
          <Route
            exact
            path="/movies/:id"
            render={() => (
              <MoviePage />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};

function App() {
  return <Routing />;
}

export default App;
