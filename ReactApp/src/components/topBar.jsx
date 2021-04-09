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
import SearchBar from "./searchBar";

class TopBar extends Component {
  state = {
    logged_in: false,
    username: "",
  };

  constructor(props) {
    super(props);
    this.getLogin();
  }

  getLogin = () => {
    fetch("http://localhost:5000/is-logged-in", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.logged_in) {
          this.setState({ logged_in: true });
          this.setState({ username: json.details.username });
        } else {
          this.setState({ logged_in: false });
        }
        console.log(json);
      });
  };

  profileRender = () => {
    if (!this.state.logged_in) {
      return (
        <div>
          <Button
            onClick={() => {
              this.props.history.push("/login");
            }}
          >
            Log in
          </Button>
        </div>
      );
    } else
      return (
        <div>
          <Button>{this.state.username}</Button>{"  "}
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Log out
          </Button>
        </div>
      );
  };

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand onClick={()=>{this.props.history.push("/")}}>Dodo Shows</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <SearchBar/>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {this.profileRender()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(TopBar);
