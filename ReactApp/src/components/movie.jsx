import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HomePage.css";
import "../styles/movieCard.css";
import ReactStars from "react-stars";
import { withRouter } from "react-router";

class Movie extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        className="movie"
        tag="a"
        onClick={() => {
          this.props.history.push(`/movies/${this.props.movie.movie_id}`);
        }}
        border="none"
        style={{ width: "250px", minheight: "470px", border:"none", borderRadius:'15px', boxShadow:"5px 5px #DEE2E6"}}
      >
        <Card.Img
          variant="top"
          src={this.props.movie.poster_url}
          style={{ /* width: "250px", */ height: "calc(250px * (40/27))" }}
        />
        <Card.ImgOverlay>
          <ReactStars
            className="home-star-rating"
            count={5}
            size={18}
            color2={"#ffd700"}
            value={this.props.movie.avg_rating * 0.5}
            edit={false}
          />
        </Card.ImgOverlay>
        <Card.Body>
          <Card.Title>{this.props.movie.movie_title}</Card.Title>
          <Card.Text>{parseDate(this.props.movie.release_date)}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

function parseDate(string) {
  var arr = string.split(" ");
  var number = arr[1];
  var order_suffix = "";
  var month = arr[2];
  var year = arr[3];
  if (number.charAt(1) == "1") order_suffix = "st";
  else if (number.charAt(1) == "2") order_suffix = "nd";
  else if (number.charAt(1) == "3") order_suffix = "rd";
  else order_suffix = "th";
  if (number.charAt(0) == "0") number = number.charAt(1);
  return number + order_suffix + " " + month + " " + year;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default withRouter(Movie);
