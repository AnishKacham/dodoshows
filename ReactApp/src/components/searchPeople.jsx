import React, { Component } from "react";
import { withRouter } from "react-router";
import {
  Navbar,
  NavDropdown,
  Nav,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import TitleSearchResults from "./titleSearchResults";
import movie from "./movie";

class SearchPeople extends Component {
  state = {
    person: "",
    results: [],
    typingTimout: 0,
    dropdownClasses: "dropdown-menu",
  };

  clickedOutside = (bool) => {
    if (bool) this.setState({ dropdownClasses: "dropdown-menu" });
  };

  changeName = (event) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({ person: event.target.value });

    if (event.target.value) {
      this.state.typingTimeout = setTimeout(this.timedSearch, 700);
    }
  };

  timedSearch = () => {
    this.searchForPeople()
      .then((response) => response.json())
      .then((json) => {
        let results = [];
        json.map(
          (person, i) => (results[i] = { id: person.person_id, name: person.person_name })
        );
        console.log(results);
        this.setState({ results: results });
        return json;
      })
      .then((results) => {
        if (results.length) {
          this.setState({
            dropdownClasses: "show dropdown-menu",
          });
        } else
          this.setState({
            dropdownClasses: "dropdown-menu",
          });
      });
  };


  searchForPeople = () => {
    return fetch("/api/search/people", {
      method: "POST",
      body: JSON.stringify({
        person: this.state.person,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

//   submitHandler = (event) => {
//     event.preventDefault();
//     if (!this.props.entryDialogue) {
//       this.searchMovie(this.state.movie)
//         .then((response) => response.json())
//         .then((json) => {
//           this.props.history.push({
//             pathname: "/",
//             state: { movies: json },
//           });
//         })
//         .then(() => {
//           window.location.reload(false);
//         });
//     }
//   };

  clickHandler = (person_id, person_title) => {
    this.clickedOutside(true);
    this.props.sendResult(person_id, person_title);
  };

  render() {
    return (
      <>
        {this.props.entryDialogue ? (
          <Form
            inline
            onSubmit={(e)=>e.preventDefault()}
            className="nav-item dropdown"
          >
            <FormControl
              type="text"
              placeholder={
                this.props.type ? this.props.type : "People"
              }
              className="mr-sm-3"
              onChange={this.changeName}
            />
            <TitleSearchResults
              type={this.props.type}
              onClick={this.clickHandler}
              entryDialogue={true}
              dropdownClasses={this.state.dropdownClasses}
              results={this.state.results}
              clickedOutside={this.clickedOutside}
            />
          </Form>
        ) : (
          <Form
            inline
            onSubmit={this.submitHandler}
            className="nav-item dropdown"
          >
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              onChange={this.changeName}
            />
            <TitleSearchResults
              onClick={this.clickHandler}
              entryDialogue={true}
              dropdownClasses={this.state.dropdownClasses}
              results={this.state.results}
              clickedOutside={this.clickedOutside}
            />
          </Form>
        )}
      </>
    );
  }
}

export default withRouter(SearchPeople);
