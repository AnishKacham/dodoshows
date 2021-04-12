import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";

class LoginPage extends Component {
  static contextType = UserContext;

  state = {
    username: "",
    password: "",
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  doLogin = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.error) alert(json.error);
        else {
          localStorage.setItem("jwt", json.jwt);
          this.context.loginUser();
          console.log(localStorage.getItem("lastLoc"));
          this.props.history.push(
            localStorage.getItem("lastLoc")
              ? localStorage.getItem("lastLoc")
              : "/"
          );
        }
      });
  };

  render() {
    return (
      <Form onSubmit={this.doLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={this.handleUsernameChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={this.handlePasswordChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default withRouter(LoginPage);
