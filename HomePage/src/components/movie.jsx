import React, { Component } from "react";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css';

class Movie extends Component {
  state = {
    id: this.props.movie.movie_id,
    title: this.props.movie.movie_title,
    description: this.props.movie.movie_description,
    release_date: this.props.movie.release_date,
    movie_length: this.props.movie.movie_length,
    pg_rating: this.props.movie.pg_rating,
    avg_rating: this.props.movie.avg_rating,
    genres: this.props.movie.genres,
    people: this.props.movie.people
  };

  render() {
    
    return (
        <Card border="secondary" style={{ width: '18rem', height: '25rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{this.state.title}</Card.Title>
          <Card.Text>{this.state.release_date}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Movie;
