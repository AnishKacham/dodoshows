import React, { Component } from "react";
import Movie from "./movie";

class Movies extends Component {
  state = {
    movies: [],
  };

  constructor() {
    super();
    console.log("called");
    this.fetchMovies();
  }

  render() {
    return (
      <div className="d-flex align-content-stretch flex-wrap bd-highlight example-parent">
        {this.state.movies.map((movie) => (
          <div key={movie.movie_id} className="p-2 bd-highlight col-example">
            <Movie movie={movie} />
          </div>
        ))}
      </div>
    );
  }

  fetchMovies() {
    fetch("http://localhost:5000/movies/", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ movies: json });
        console.log(this.state.movies);
      });
  }
}

export default Movies;
