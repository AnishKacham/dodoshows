import React, { Component } from "react";
import { withRouter } from "react-router";
import Movie from "./movie";

class Movies extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className="d-flex align-content-stretch flex-wrap bd-highlight example-parent">
        {this.props.movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="p-2 bd-highlight col-example home-page-movie"
          >
            <Movie movie={movie} />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(Movies);
