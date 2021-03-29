import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route
            path="/movies/:id"
            render={({ match }) => <MoviePage movie_id={match.params.id} />}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
