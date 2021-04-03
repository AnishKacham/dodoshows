import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HomePage.css";
import ReactStars from "react-stars";
import { withRouter } from "react-router";

class Movie extends Component {
  state = {
    id: this.props.movie.movie_id,
    title: this.props.movie.movie_title,
    description: this.props.movie.movie_description,
    release_date: this.props.movie.release_date,
    movie_length: this.props.movie.movie_length,
    pg_rating: this.props.movie.pg_rating,
    avg_rating: this.props.movie.avg_rating,
    clicked: false,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        tag="a"
        onClick={() => {
          this.props.history.push(`/movies/${this.state.id}`);
        }}
        border="secondary"
        style={{ width: "250px", height: "470px" }}
      >
        <Card.Img
          variant="top"
          src="https://i.insider.com/5ca3d2b892c8866e8b4618d9?width=750&format=jpeg&auto=webp"
          style={{ width: "250px", height: "calc(250px * (40/27))" }}
        />
        <Card.ImgOverlay>
          <ReactStars
          className = "home-star-rating"
            count={5}
            size={18}
            color2={"#ffd700"}
            value={this.state.avg_rating * 0.5}
            edit={false}
          />
        </Card.ImgOverlay>
        <Card.Body>
          <Card.Title>{this.state.title}</Card.Title>
          <Card.Text>{parseDate(this.state.release_date)}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

function parseDate(string) {
  var arr = string.split(" ");
  var number = arr[1];
  var idkWhatThisIsCalled = "";
  var month = arr[2];
  var year = arr[3];
  if (number.charAt(1) == "1") idkWhatThisIsCalled = "st";
  else if (number.charAt(1) == "2") idkWhatThisIsCalled = "nd";
  else if (number.charAt(1) == "3") idkWhatThisIsCalled = "rd";
  else idkWhatThisIsCalled = "th";
  if (number.charAt(0) == "0") number = number.charAt(1);
  return number + idkWhatThisIsCalled + " " + month + " " + year;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default withRouter(Movie);