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
import LoginPage from "./pages/LoginPage";
import ShowsPage from "./pages/ShowsPage";
import SeatsPage from "./pages/SeatsPage";

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
          <Route
            exact
            path="/login"
            render={() => (
              <LoginPage />
            )}
          />
          <Route
            exact
            path="/shows/:id/seats"
            render={() => (
              <SeatsPage />
            )}
          />
          <Route
            exact
            path="/movies/:id/shows"
            render={() => (
              <ShowsPage/>
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
