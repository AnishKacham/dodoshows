import React, { Component } from "react";

class Movie extends Component {
  state = {
    id,
    title,
    description,
    release_date,
    movie_length,
    pg_rating,
    avg_rating,
  };

  render() {
    return (
      <div>
        <div>{this.state.title}</div>
        <div>{this.state.release_date}</div>;
      </div>
    );
  }
}

export default Movie;
