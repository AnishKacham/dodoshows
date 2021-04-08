import React, { Component } from "react";
import { Nav } from "react-bootstrap";

class SideBar extends Component {
  state = {};
  render() {
    return (<>
    
        <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={selectedKey => alert(`selected ${selectedKey}`)}
        >
            <div className="sidebar-sticky"></div>
        <Nav.Item>
            <Nav.Link href="/home">About Us</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey="link-1">Report Issue</Nav.Link>
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
      
    </>);
  }
}

export default SideBar;
