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
      <div style={{display:"flex", flexWrap:"wrap"}}/* className="d-flex align-content-stretch flex-wrap bd-highlight example-parent" */>
        {this.props.movies.map((movie) => (
          <div
            style={{margin:"20px 20px"}}
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
