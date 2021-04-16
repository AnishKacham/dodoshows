import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { withRouter } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../contexts/userContext";
import { Navbar, NavDropdown, Nav, Form, FormControl } from "react-bootstrap";
import {
  Avatar,
  Typography,
  Chip,
  MenuItem,
  Menu,
  Divider,
  Popper,
  Paper,
  Grow,
  MenuList,
  Button,
  ClickAwayListener,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchBar from "./searchBar";
import { Justify } from "react-bootstrap-icons";
import { colors } from "@material-ui/core";

const ProfileRender = () => {
  let user = useContext(UserContext);
  let history = useHistory();
  let location = useLocation();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  console.log(user);
  if (!Object.keys(user.user).length) {
    return (
      <div>
        <Button
          onClick={() => {
            localStorage.setItem("lastLoc", location.pathname);
            history.push("/login");
          }}
        >
          Log in
        </Button>
      </div>
    );
  } else
    return (
      <div
        style={{
          border: "grey",
          borderWidth: "1px",
          borderRadius: "30px",
          borderStyle: "solid",
          padding: "5px",
          textAlign: "center",
        }}
        onClick={handleToggle}
      >
        {user.user.profile_url ? (
          <Avatar src={user.user.profile_url} ref={anchorRef}></Avatar>
        ) : (
          <Avatar ref={anchorRef}>
            {user.user.username.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <Menu
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          disablePortal
          transition
        >
          <MenuList id="menu-list-grow">
            <MenuItem onClick={() => user.logoutUser()}>Logout</MenuItem>
          </MenuList>
        </Menu>
        {/* <Button
          onClick={() => {
            this.context.logoutUser();
          }}
        >
          Log out
        </Button> */}
      </div>
    );
};

class TopBar extends Component {
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
            
            <SearchBar entryDialogue={false} />
            <Nav.Link onClick={()=>this.props.history.push("/advancedSearch")}>Advanced search</Nav.Link>
          </Nav>
          <ProfileRender />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(TopBar);
