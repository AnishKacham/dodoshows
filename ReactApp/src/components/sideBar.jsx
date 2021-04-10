import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";

class SideBar extends Component {
  static contextType = UserContext;
  state = {};

  goToListPage = () => {
    if (!Object.keys(this.context.user).length) {
      localStorage.setItem("lastLoc", "/");
      this.props.history.push("/login");
    } else this.props.history.push(`/users/${this.context.user.user_id}/lists`);
  };

  render() {
    return (
      <>
        <Nav
          className="col-md-12 d-none d-md-block bg-light sidebar"
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <div className="sidebar-sticky"></div>
          <Nav.Item>
            <Nav.Link onClick={this.goToListPage}>Lists</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Disabled
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
    );
  }
}

export default withRouter(SideBar);
