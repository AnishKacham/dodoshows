import { Button, Modal, Form } from "react-bootstrap";
import React, { Component, useContext, useState } from "react";
import UserContext from "../contexts/userContext";
import { useHistory, withRouter } from "react-router";

const ListDialogue = (props) => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(false);
  const user = useContext(UserContext);

  const submitList = (event) => {
    event.preventDefault();
    console.log(name);
    console.log(isPrivate);
    console.log(localStorage.getItem("jwt"));
    fetch("/api/lists/", {
      method: "POST",
      body: JSON.stringify({
        list_name: name,
        is_private: isPrivate,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          console.log(user);
          localStorage.setItem("lastLoc", `${history.location.pathname}`);
          history.push("/login");
        }
      })
      .then(() => {
        props.reloadPage();
      });
  };
  return (
    <Modal show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Add List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitList}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter List Name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Make this private"
              defaultChecked={isPrivate}
              onChange={(e) => setPrivate(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeDialogue}>
          Close
        </Button>
        <Button variant="primary">Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

class AddList extends Component {
  state = { show: false };
  render() {
    return (
      <Button style={{ marginTop: "20px" }} onClick={this.props.onClick}>
        Add list
      </Button>
    );
  }
}
export { ListDialogue };
export default withRouter(AddList);
