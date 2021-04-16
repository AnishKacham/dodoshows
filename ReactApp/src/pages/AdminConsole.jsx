// import React, { Component } from "react";
// import { withRouter } from "react-router";
// import {Button} from "react-bootstrap";
// import {
//     FormControl,
//     FormHelperText,
//     Input,
//     InputLabel,
//     FormGroup,
//     Grid,
//     Snackbar,
//     TextField,
//     Container,
//     Typography,
//     Button,
//     Box,
//   } from "@material-ui/core";
// import "../styles/AdminConsole.css";
// class AdminConsole extends Component{
//     constructor(props){
//         super(props);
//         this.state={
//             MID:"",
//             TID:"",
//             DT:"",
//             TP:""
//         }

//     }

//     SetValue=(event)=>{
//         this.setState({[event.target.name]: event.target.value})
//         console.log(this.state);
//     }
//     AddShow=()=>{
//         console.log("Entered");
//         fetch(`/api/shows/`, {
//             method: "POST",
//             body: JSON.stringify({
//                 movie_id: parseInt(this.state.MID),
//                   theatre_id: parseInt(this.state.TID),
//                   date_time:this.state.DT,
//                   ticket_price: parseInt(this.state.TP)
//             }),
//             headers: {
//               "Content-type": "application/json; charset=UTF-8",
//               Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//             },
//           })
//             .then((response) => response.json())
//             .then((json) => {
//              console.log("From addshows: ",json);
//             });
//     }

//     render(){
//         return(
//             <>
//             <div className="ConsoleHeader"> <Button variant = "success" size="lg" style={{position:"absolute",marginLeft:"30px",top:"30%"}} onClick={() => {
//                 this.props.history.push("/");
//               }}>Back to Home</Button> <p className = "Header">ADMIN CONSOLE</p> </div>

//             <div className ="AddZone">
//             <p className = "ConsoleTitle" ><u><b>SET SHOW DETAILS</b></u>  </p>

//             <form style={{marginLeft:"30px", marginTop:"80px"}} onSubmit = {this.AddShow}>

//             <label htmlFor="MID" style={{color:"green"}}>Movie ID:</label><br/>
//             <input type="text" id="MID" name="MID" value = {this.state.MID} onChange={this.SetValue}/><br/><br/>

//             <label htmlFor="TID" style={{color:"green"}}>Theatre ID:</label><br/>
//             <input type="text" id="TID" name="TID" value = {this.state.TID} onChange={this.SetValue}/><br/><br/>

//             <label htmlFor="TP" style={{color:"green"}}>Ticket Price:</label><br/>
//             <input type="text" id="TP" name="TP" value = {this.state.TP} onChange={this.SetValue}/><br/><br/>

//             <label htmlFor="DT" style={{color:"green"}}>Date-Time(Please enter in YYYY-MM-DD HH:MM:SS format):</label><br/>
//             <input type="text" id="DT" name="DT" value = {this.state.DT} onChange={this.SetValue}/><br/><br/>

//             <input type="submit" value="Add Show" style={{backgroundColor: "Yellow",position: "relative",marginLeft:"30%",marginRight:"30%", width:"40%"}}/>
//             </form>

//             </div>

//             </>

//         );
//     }
// }

// export default withRouter(AdminConsole);
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
import { useLocation, withRouter } from "react-router";
import { Link, NavLink, useHistory} from "react-router-dom";
import UserContext from "../contexts/userContext";
import SearchBar from "../components/searchBar";

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

const AdminConsole = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  let user = useContext(UserContext);

  let history = useHistory();
  let location = useLocation();
  const [movie, setMovie] = useState({});
  const [theatre, setTheatre] = useState({});
  const [ticketPrice, setTicketPrice] = useState(0);
  const [dateTime, setDateTime] = useState("");
  const [hasSelectedMovie, setHasSelectedMovie] = useState(false);

  useEffect(() => {
    console.log(user.user);
    console.log(location);
    if(location.state.movie_id)
    {
        setMovie({movie_id: location.state.movie_id, movie_name: location.state.movie_name});
        setHasSelectedMovie(true);
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getMovie = (movie_id, movie_name) => {
    console.log(movie_id, movie_name);
    setMovie({ movie_id: movie_id, movie_name: movie_name });
    setHasSelectedMovie(true);
  };

  const MovieDisplay = () => {
    if (hasSelectedMovie) {
      return (
        <div>
          {movie.movie_id}
          {":"}
          <Button variant="contained" style={{ marginLeft: "10px" }}>
            {movie.movie_name}
          </Button>
          <IconButton
            aria-label="delete"
            onClick={() => setHasSelectedMovie(false)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      );
    } else {
      return (
        <SearchBar entryDialogue={true} sendResult={getMovie} type="movie" />
      );
    }
  };

  const addShow = () => {
    console.log(movie, theatre, ticketPrice, dateTime);

    if (!hasSelectedMovie) {
      setErrorAlert("Please select a movie from the given dropdown");
      setOpen(true);
      return;
    }
    if (dateTime == "") {
      setErrorAlert("Please pick a date and time");
      setOpen(true);
      return;
    }
    if (theatre == "") {
      setErrorAlert("Please pick a theatre");
      setOpen(true);
      return;
    }
    if (ticketPrice == "") {
      setErrorAlert("Please set a ticket price");
      setOpen(true);
      return;
    }

    let dateTimeParts = dateTime.split('T');
    const newDateTime = dateTimeParts[0] + " " + dateTimeParts[1] + ":00";
    console.log(newDateTime);
    fetch(`/api/shows/`, {
      method: "POST",
      body: JSON.stringify({
        movie_id: movie.movie_id,
        theatre_id: theatre,
        date_time: newDateTime,
        ticket_price: ticketPrice,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
        <Box fontWeight="fontWeightBold">Admin Console</Box>
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
                <MovieDisplay />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Theatre ID"
                  name="theatre"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setTheatre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ticket Price"
                  name="theatre"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setTicketPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="datetime-local"
                  label="Scheduled date and time"
                  type="datetime-local"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setDateTime(e.target.value)}
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
              onClick={addShow}
            >
              Add Show
            </Button>
          </Grid>

          <Grid item xs={12} align="center">
            <Typography>
              Not here to add a show?{" "}
              <Link
                to="/"
                style={{ textDecoration: "none", color: "#3f50b5" }}
              >
                <Box fontWeight="fontWeightBold">Take me home</Box>
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

export default withRouter(AdminConsole);
