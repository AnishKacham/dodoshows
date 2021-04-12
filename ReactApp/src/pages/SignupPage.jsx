import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import SearchBar from "../components/searchBar";
import UserContext from "../contexts/userContext";

class SignupPage extends Component {
  static contextType = UserContext;

  state = {
    username: "",
    password: "",
    email: "",
    city_id: 0,
    city_name: "",
    has_selected_city: false,
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  doSignup = () => {
    fetch("http://localhost:5000/api/signup", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        city_id: this.state.city_id,
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

  getCity = (city_id, city_name) => {
    console.log(city_id, city_name);
    this.setState({
      city_id: city_id,
      city_name: city_name,
      has_selected_city: true,
    });
  };

  cityDisplay = () => {
    if (this.state.has_selected_city) {
      return (
        <div>
          <Button onClick={() => this.setState({ has_selected_city: false })}>
            {this.state.city_name}
          </Button>
        </div>
      );
    } else {
      return (
        <SearchBar entryDialogue={true} sendResult={this.getCity} type="city" />
      );
    }
  };

  render() {
    return (
      <>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={this.handleEmailChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicUsername">
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
        {this.cityDisplay()}
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "20px" }}
          onClick={() => this.doSignup()}
        >
          Submit
        </Button>
      </>
    );
  }
}

export default withRouter(SignupPage);
