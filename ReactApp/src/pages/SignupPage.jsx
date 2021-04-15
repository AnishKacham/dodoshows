import SearchBar from "../components/searchBar";
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
  IconButton,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
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

const SignupPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  let user = useContext(UserContext);

  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cityId, setCityId] = useState(0);
  const [cityName, setCityName] = useState("");
  const [hasSelectedCity, setHasSelectedCity] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getCity = (city_id, city_name) => {
    console.log(city_id, city_name);
    setCityId(city_id);
    setCityName(city_name);
    setHasSelectedCity(true);
  };

  const CityDisplay = () => {
    if (hasSelectedCity) {
      return (
        <div>
          <Button variant="contained">
            {cityName}
          </Button>
          <IconButton aria-label="delete" onClick={() => setHasSelectedCity(false)}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </div>
      );
    } else {
      return (
        <SearchBar entryDialogue={true} sendResult={getCity} type="city" />
      );
    }
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setErrorAlert("Your email is not valid!");
      setOpen(true);
      return;
    }

    if (!hasSelectedCity) {
      setErrorAlert("Please select a city from the given dropdown");
      setOpen(true);
      return;
    }
    fetch("http://localhost:5000/api/signup", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        city_id: cityId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          setErrorAlert(json.error);
          setOpen(true);
        } else {
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
        <Box fontWeight="fontWeightBold">Sign up</Box>
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autocomplete="off"
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <CityDisplay />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              fullWidth
              type="submit"
              variant="contained"
              onClick={() => uploadFields()}
            >
              Sign up
            </Button>
          </Grid>

          <Grid item xs={12} align="center">
            <Typography>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#3f50b5" }}
              >
                <Box fontWeight="fontWeightBold">Login</Box>
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">{errorAlert}</Alert>
      </Snackbar>
    </Container>
  );
};

export default withRouter(SignupPage);
