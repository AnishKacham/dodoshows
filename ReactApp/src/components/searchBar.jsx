import React, { Component } from "react";
import { withRouter } from "react-router";
import {
  Navbar,
  NavDropdown,
  Nav,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import TitleSearchResults from "./titleSearchResults";
import movie from "./movie";

class SearchBar extends Component {
  state = {
    city: "",
    movie: { title: "", genres: [], people: [] },
    results: [],
    typingTimout: 0,
    dropdownClasses: "dropdown-menu",
  };

  clickedOutside = (bool) => {
    if (bool) this.setState({ dropdownClasses: "dropdown-menu" });
  };

  changeName = (event) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    if (this.props.type && this.props.type == "city") {
      this.setState({ city: event.target.value });
    } else {
      this.setState({
        movie: {
          title: `${event.target.value}`,
          genres: this.state.movie.genres,
          people: this.state.movie.people,
        },
      });
    }
    if (event.target.value) {
      this.state.typingTimeout = setTimeout(this.timedSearch, 700);
    }
  };

  timedSearch = () => {
    if (this.props.type == "city") {
      this.searchCities(this.state.city)
        .then((response) => response.json())
        .then((json) => {
          let results = [];
          json.map(
            (city, i) =>
              (results[i] = { id: city.city_id, name: city.city_name })
          );
          console.log(results);
          this.setState({ results: results });
          return json;
        })
        .then((results) => {
          if (results.length) {
            this.setState({
              dropdownClasses: "show dropdown-menu",
            });
          } else
            this.setState({
              dropdownClasses: "dropdown-menu",
            });
        });
    } else {
      this.searchMovie(this.state.movie)
        .then((response) => response.json())
        .then((json) => {
          let results = [];
          json.map(
            (movie, i) =>
              (results[i] = { id: movie.movie_id, name: movie.movie_title })
          );
          console.log(results);
          this.setState({ results: results });
          return json;
        })
        .then((results) => {
          if (results.length) {
            this.setState({
              dropdownClasses: "show dropdown-menu",
            });
          } else
            this.setState({
              dropdownClasses: "dropdown-menu",
            });
        });
    }
  };

  searchMovie = (movie) => {
    return fetch("http://localhost:5000/search/movies", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  searchCities = (city) => {
    return fetch("http://localhost:5000/search/cities", {
      method: "POST",
      body: JSON.stringify({
        city: city,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    if (!this.props.entryDialogue) {
      this.searchMovie(this.state.movie)
        .then((response) => response.json())
        .then((json) => {
          this.props.history.push({
            pathname: "/",
            state: { movies: json },
          });
        })
        .then(() => {
          window.location.reload(false);
        });
    }
  };

  clickHandler = (movie_id, movie_title) => {
    this.clickedOutside(true);
    this.props.sendResult(movie_id, movie_title);
  };

  render() {
    return (
      <>
        {this.props.entryDialogue ? (
          <Form
            inline
            onSubmit={this.submitHandler}
            className="nav-item dropdown"
          >
            <FormControl
              type="text"
              placeholder={
                this.props.type ? this.props.type : "Search for a movie..."
              }
              className="mr-sm-2"
              onChange={this.changeName}
            />
            <TitleSearchResults
              type={this.props.type}
              onClick={this.clickHandler}
              entryDialogue={this.props.entryDialogue}
              dropdownClasses={this.state.dropdownClasses}
              results={this.state.results}
              clickedOutside={this.clickedOutside}
            />
          </Form>
        ) : (
          <Form
            inline
            onSubmit={this.submitHandler}
            className="nav-item dropdown"
          >
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              onChange={this.changeName}
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
            <TitleSearchResults
              onClick={this.clickHandler}
              entryDialogue={this.props.entryDialogue}
              dropdownClasses={this.state.dropdownClasses}
              results={this.state.results}
              clickedOutside={this.clickedOutside}
            />
          </Form>
        )}
      </>
    );
  }
}

export default withRouter(SearchBar);
