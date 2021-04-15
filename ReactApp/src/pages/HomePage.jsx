import search from "../images/search.svg";
import "../styles/HomePage.css";
import React, { Component } from "react";
import UserContext from "../contexts/userContext";
import Movies from "../components/movies";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Carousel,Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";

class HomePage extends Component {
  static contextType = UserContext;

  state = {
    movies: [],
  };

  constructor(props) {
    super(props);
    console.log(this);
    if (props.location.state) {
      this.state = { movies: props.location.state.movies };
      console.log(this.state);
    } else this.fetchMovies();
  }

  fetchMovies = () => {
    fetch("http://localhost:5000/api/movies/", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ movies: json });
        console.log(this.state.movies);
      });
  };

  render() {
    return (
        <div>
          <TopBar />
          {/* <br></br> */}
          <Row>
            <Col xs={2} id="sidebar-wrapper">
              <SideBar />
            </Col>
            <Col xs={10} id="page-content-wrapper">
              <Container>
                <Movies movies={this.state.movies} />
              </Container>
            </Col>
          </Row>
        </div>
      
    );
  }
}
export default withRouter(HomePage);
