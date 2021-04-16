import search from "../images/search.svg";
import "../styles/HomePage.css";
import React, { Component } from "react";
import UserContext from "../contexts/userContext";

import Movies from "../components/movies";
import SideBar from "../components/sideBar";
import SearchPeople from "../components/searchPeople";
import TopBar from "../components/topBar";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import { withRouter } from "react-router";

import { Typography, TextField } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";

class AdvancedSearch extends Component {
  static contextType = UserContext;

  state = {
    chipData: [],
    movies: [],
    searchTerm: "",
  };

  constructor(props) {
    super(props);
    console.log(this);
  }

  handleDelete = (chipToDelete) => () => {
    this.setState({
      chipData: this.state.chipData.filter(
        (chip) => chip.key !== chipToDelete.key
      ),
    });
  };

  addChip = (id, title) => {
    let newChipData = this.state.chipData;
    newChipData.push({
      key: id,
      label: title,
      person_id: id,
      person_title: title,
    });
    this.setState({ chipData: newChipData });
    console.log(this.state.chipData);
  };

  setSearchTerm = (event) => {
    this.setState({ searchTerm: event.target.value });
    console.log(this.state);
  };

  findMovies = () => {

    let listPeopleID=[];
    this.state.chipData.map(el => (
      listPeopleID.push(el.person_id)
    ));
    fetch("http://localhost:5000/api/search/movies", {
      method: "POST",
      body: JSON.stringify(
        {
          title: this.state.searchTerm,
          people: listPeopleID,
          genres: []
        }
      ),
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
                <Typography variant="h5" style={{marginBottom: "30px"}}>Advanced Search</Typography>
                <TextField
                style={{display: "block", marginBottom: "30px"}}
                  id="standard-basic"
                  label="Title"
                  onInput={this.setSearchTerm}
                />
                <SearchPeople
                  entryDialogue={true}
                  sendResult={this.addChip}
                ></SearchPeople>
                <Paper
                  component="ul"
                  key={
                    this.state.chipData ? this.state.chipData.length : "empty69"
                  }
                >
                  {this.state.chipData.map((data) => {
                    return (
                      <li key={data.key}>
                        <Chip
                          label={data.label}
                          onDelete={this.handleDelete(data)}
                        />
                      </li>
                    );
                  })}
                </Paper>
                
                <Button onClick={this.findMovies} style={{marginTop: "20px"}}>Search with filters</Button>
                <Movies movies={this.state.movies} />
              </Container>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default withRouter(AdvancedSearch);
