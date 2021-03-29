import React, { Component } from "react";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import MovieDetailed from "../components/movieDetailed";

class MoviePage extends Component {
  state = {
      movie_id: this.props.movie_id,
    };

  constructor(props) {
    super(props);
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
                <MovieDetailed movie_id={this.state.movie_id}/>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MoviePage;
