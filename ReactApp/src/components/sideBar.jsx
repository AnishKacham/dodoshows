import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";
// import '../styles/sideBar.css';

class SideBar extends Component {
  static contextType = UserContext;
  state = {};

  goToListPage = () => {
    if (!Object.keys(this.context.user).length) {
      localStorage.setItem("lastLoc", "/");
      this.props.history.push("/login");
    } else this.props.history.push(`/users/${this.context.user.user_id}/lists`);
  };

  goToFriendsPage = () => {
    if (!Object.keys(this.context.user).length) {
      localStorage.setItem("lastLoc", "/");
      this.props.history.push("/login");
    } else this.props.history.push("/friends");
  };

  render() {
    return (
      <div className="side-bar-wrapper" style={{/* position:"fixed", */height:"500px", position:"sticky", top:"68px",width:"12vw"}}>
        <Nav
          className="col-md-12 d-none d-md-block bg-dark sidebar"
          style={{minHeight:"93vh"}}
          activeKey="/home"
        >
            <div className="sidebar-sticky"></div>
            <Nav.Item>
            <Nav.Link onClick={this.goToListPage}>Lists</Nav.Link>
          </Nav.Item>
        <Nav.Item>
            <Nav.Link disabled>About Us</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link onClick={this.goToFriendsPage} eventKey="link-1">Profile and friends </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey="link-2" disabled>Donate</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey="link-3" disabled>
            Merchandise
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default withRouter(SideBar);
