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

  render() {
    return (
      <div className="side-bar-wrapper" style={{/* position:"fixed", */ position:"sticky",top:"0",width:"12vw"}}>
        <Nav
          className="col-md-12 d-none d-md-block bg-dark sidebar"
          style={{minHeight:"100vh"}}
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
            <div className="sidebar-sticky"></div>
            <Nav.Item>
            <Nav.Link onClick={this.goToListPage}>Lists</Nav.Link>
          </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/home">About Us</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/friends" eventKey="link-1">Friends</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey="link-2">Donate</Nav.Link>
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
