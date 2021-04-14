import React, { Component } from "react";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import MovieDetailed from "../components/movieDetailed";
import { withRouter } from "react-router";

class MoviePage extends Component {
  state = {
    movie_id: this.props.match.params.id,
  };

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <>
        <Container fluid style={{maxWidth:"350px"}}> 
          <TopBar />
          <br></br>
          <Row style={{display:"flex",justifyContent:"flex-start"}}>
            <Col xs={2} id="sidebar-wrapper">
              <SideBar />
            </Col>
            <Col /* xs={10} */ style={{display:"flex",justifyContent:"flex-start", maxWidth:"350px"}}>
              <MovieDetailed movie_id={this.state.movie_id} style={{maxWidth:"350px"}}/>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(MoviePage);
