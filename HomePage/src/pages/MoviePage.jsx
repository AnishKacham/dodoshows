import React, { Component } from "react";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import MovieDetailed from "../components/movieDetailed";

class MoviePage extends Component {
  state = {
      movie: [],
      people: [],
      genres: []
    };

  constructor() {
    super();
    this.fetchMovie(1);
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
                <MovieDetailed movie={this.state.movie} people={this.state.people} genres={this.state.genres}/>
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
      .then(response => response.json())
      .then((json) => {
        this.setState({movie:json});
        this.setState({people:json.people});
        this.setState({genres: json.genres});
      });
  }
}

export default MoviePage;
