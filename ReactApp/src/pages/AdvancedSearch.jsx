import search from "../images/search.svg";
import "../styles/HomePage.css";
import React, { Component } from "react";
import UserContext from "../contexts/userContext";

import Movies from "../components/movies";
import SideBar from "../components/sideBar";
import SearchPeople from "../components/searchPeople";
import TopBar from "../components/topBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";

import { Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";

class AdvancedSearch extends Component {
  static contextType = UserContext;

  state = {
    people: [],
    chipData: [],
  };

  constructor(props) {
    super(props);
    console.log(this);
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
              <Container>
                <Typography variant="h5">Advanced Search</Typography>
                <SearchPeople>
                  {" "}
                  entryDialogue={true} sendResult={(person) => person}
                </SearchPeople>
              </Container>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default withRouter(AdvancedSearch);
