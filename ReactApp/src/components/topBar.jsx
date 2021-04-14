import React, { Component } from "react";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";
import {
  Navbar,
  NavDropdown,
  Nav,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import SearchBar from "./searchBar";
import { Justify } from "react-bootstrap-icons";
import { colors } from "@material-ui/core";

class TopBar extends Component {
  static contextType = UserContext;
  state = {};

  constructor(props, context) {
    super(props, context);
    console.log(this.context);
  }

  profileRender = () => {
    if (!Object.keys(this.context.user).length) {
      return (
        <div>
          <Button
            onClick={() => {
              console.log(this.props);
              localStorage.setItem("lastLoc", this.props.location.pathname);
              this.props.history.push("/login");
            }}
          >
            Log in
          </Button>
        </div>
      );
    } else
      return (
        <div style={{display:"flex", justifyContent:"flex-start", color:"white"}}>
          <Navbar.Brand>Hello {this.context.user.username}</Navbar.Brand>
{/*           <Button>{this.context.user.username}</Button> */}
          {'  '} 
          <Button variant="primary"
            onClick={() => {
              this.context.logoutUser();
            }}
          >
            Log out
          </Button>
        </div>
      );
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand='lg' sticky="top">
        <Navbar.Brand>Dodo Shows</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <SearchBar entryDialogue={false} />
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
