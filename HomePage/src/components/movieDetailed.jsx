import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class MovieDetailed extends Component {
  state = {
    id: this.props.movie.movie_id,
    title: this.props.movie.movie_title,
    description: this.props.movie.movie_description,
    release_date: this.props.movie.release_date,
    movie_length: this.props.movie.movie_length,
    pg_rating: this.props.movie.pg_rating,
    avg_rating: this.props.movie.avg_rating,
    genres: this.props.genres,
    people: this.props.people
  };

  render() {
    return (
      <div>
          {this.state.people.map(person => <div>{person.person_name}</div>)}
      </div>
    );
  }
}

export default MovieDetailed;
