import React, { Component, useContext, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  FormGroup,
  Grid,
  Snackbar,
  TextField,
  Container,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import { Link, NavLink, useHistory } from "react-router-dom";
import UserContext from "../contexts/userContext";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 65,
    alignItems: "flex-start",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  let user = useContext(UserContext);

  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const doLogin = () => {
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
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
          user.loginUser();
          console.log(localStorage.getItem("lastLoc"));
          history.push(
            localStorage.getItem("lastLoc")
              ? localStorage.getItem("lastLoc")
              : "/"
          );
        }
      });
  };
  return (
    <Container
      className={classes.container}
      maxWidth="xs"
      container
      align="center"
    >
      <Typography>
        <Box fontWeight="fontWeightBold">Login</Box>
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Grid container spacing={3} style={{ paddingTop: 40 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  size="small"
                  type="password"
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              fullWidth
              type="submit"
              variant="contained"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </Grid>

          <Grid item xs={12} align="center">
            <Typography>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "#3f50b5" }}
              >
                <Box fontWeight="fontWeightBold">Sign up</Box>
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">Your form details are not valid!</Alert>
      </Snackbar>
    </Container>
    // <Form onSubmit={this.doLogin}>
    //   <Form.Group controlId="formBasicEmail">
    //     <Form.Label>Username</Form.Label>
    //     <Form.Control
    //       type="text"
    //       placeholder="Enter username"
    //       onChange={this.handleUsernameChange}
    //     />
    //   </Form.Group>

    //   <Form.Group controlId="formBasicPassword">
    //     <Form.Label>Password</Form.Label>
    //     <Form.Control
    //       type="password"
    //       placeholder="Password"
    //       onChange={this.handlePasswordChange}
    //     />
    //   </Form.Group>
    //   <Button variant="primary" type="submit">
    //     Submit
    //   </Button>
    // </Form>
  );
};

export default withRouter(LoginPage);
