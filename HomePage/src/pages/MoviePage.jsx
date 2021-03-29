import React, { Component } from "react";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import MovieDetailed from "../components/movieDetailed";

class MoviePage extends Component {
  state = {
      movie: [],
    };

  constructor() {
    super();
    this.fetchMovie(3);
  }
  render() {
    return (
      <>
        <Container fluid>
          <TopBar />
          <br></br>
          <Row>
            <Col xs={2} id="sidebar-wrapper">
              <SideBar />
            </Col>
            <Col xs={10} id="page-content-wrapper">
              {this.state.movie.movie_id}
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  fetchMovie(movie_id) {
    fetch(`http://localhost:5000/movies/${movie_id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ movie: json });
        console.log(this.state.movie);
      });
  }
}

export default MoviePage;
