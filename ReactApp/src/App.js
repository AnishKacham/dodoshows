import React, { useState, useContext, Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage"
import ShowsPage from "./pages/ShowsPage";
import SeatsPage from "./pages/SeatsPage";
import BookingPage from "./pages/BookingPage";
import ListsPage from "./pages/ListsPage";
import SignupPage from "./pages/SignupPage";
import FriendsPage from "./pages/FriendsPage";

import UserContext, { UserProvider } from "./contexts/userContext";

const Routing = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route
            exact
            path="/movies/:id"
            render={(props) => (
              <MoviePage key={props.match.params.id} {...props} />
            )}
          />
          <Route
            exact
            path="/users/:id/lists"
            render={(props) => (
              <ListsPage key={props.match.params.id} {...props} />
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
            path="/shows/:id/book"
            render={() => (
              <BookingPage />
            )}
          />
          <Route
            exact
            path="/movies/:id/shows"
            render={() => (
              <ShowsPage/>
            )}
          />
          <Route
            exact
            path="/users"
            render={() => (
              <UsersPage/>
            )}
            />
          <Route exact path="/login" render={() => <LoginPage />} />
          <Route exact path="/signup" render={() => <SignupPage />} />
          <Route exact path="/friends" render={()=> <FriendsPage/>} />
        </Switch>
      </div>
    </Router>
  );
};

function getDetails() {
  return fetch("http://localhost:5000/api/is-logged-in", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  logout = () => {
    localStorage.clear();
    this.setState({ user: {} });
  };

  login = () => {
    getDetails()
      .then((response) => response.json())
      .then((json) => {
        if (json.logged_in) {
          this.setState({
            user: {
              user_id: json.details.user_id,
              username: json.details.username,
              city_id: json.details.city_id,
              city: json.details.city_name,
            },
          });
          console.log(this.state.user);
        } else
          this.setState({
            user: {},
          });
        console.log(json);
      });
  };

  componentDidMount() {
    this.login();
  }
  render() {
    const value = {
      user: this.state.user,
      logoutUser: this.logout,
      loginUser: this.login,
    };
    return (
      <UserContext.Provider value={value}>
        <Routing />
      </UserContext.Provider>
    );
  }
}

export default App;
