import React, { Component, useContext, useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router";
import {
  Card,
  Image,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import { Rating } from "@material-ui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../contexts/userContext";
import "../styles/personCard.css";
import lists from "./lists";

const FullRating = (props) => {
  let [newRating, setNewRating] = useState({
    movie_id: props.movie_id,
    watch_status: 0,
    score: 0,
    review: "",
  });
  let user = useContext(UserContext);
  let [rating, setRating] = useState({
    user_id: 0,
    movie_id: 0,
    watch_status: 0,
    score: 0,
    review: "",
  });
  let [ratingExists, setRatingExists] = useState(false);
  let [lists, setLists] = useState([]);
  let [editMode, setEditMode] = useState(true);
  let history = useHistory();

  useEffect(() => {
    console.log(user.user);
    console.log(props);
    fetchRating();
    fetchLists();
  }, [user]);

  const fetchRating = () => {
    console.log(user.user);
    console.log(props);
    if (Object.keys(user.user).length)
      fetch(
        `http://localhost:5000/users/${user.user.user_id}/${props.movie_id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json && Object.keys(json).length && !json.msg) {
            setRatingExists(true);
            setRating(json);
            setEditMode(false);
            setNewRating((prevState) => ({
              ...prevState,
              watch_status: json.watch_status,
              score: json.score,
              review: json.review,
            }));
          }
        });
  };

  const fetchLists = () => {
    console.log(user.user);
    console.log(props);
    if (Object.keys(user.user).length)
      fetch(
        `http://localhost:5000/users/${user.user.user_id}/movies/${props.movie_id}/lists`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json && Object.keys(json).length && !json.msg) {
            setLists(json);
          }
        });
  };

  const submitRating = () => {
    console.log(newRating);
    fetch(`http://localhost:5000/users/${user.user.user_id}`, {
      method: ratingExists ? "PUT" : "POST",
      body: JSON.stringify(newRating),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => {
        if (response.status != 200) {
          localStorage.setItem("lastLoc", `${history.location.pathname}`);
          history.push("/login");
        }
      })
      .then(() => {
        fetchRating();
        setEditMode(false);
      });
  };
  console.log(Object.keys(rating).length);
  if (Object.keys(user.user).length && rating) {
    if (!editMode) {
      if (ratingExists && Object.keys(rating).length) {
        return (
          <Row>
            <Col>
              <Card
                border={rating.watch_status ? "success" : "secondary"}
                style={{ width: "18rem" }}
              >
                <Card.Header>
                  {rating.watch_status ? "Watched" : "Plan to watch"}
                </Card.Header>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>
                    <Card.Text>
                      Your score:
                      <Rating
                        name="read-only"
                        value={rating.score}
                        max={10}
                        precision={1}
                        size="small"
                        readOnly
                      />
                    </Card.Text>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Card.Title>Your review:</Card.Title>
                    <Card.Text>{rating.review}</Card.Text>
                  </ListGroupItem>
                </ListGroup>
                <Card.Footer>
                  <Button size="sm" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            <Col>
              <div className="btn-group-justified btn-group-vertical">
                <div style={{ marginBottom: "10px" }}>Present in lists:</div>
                {lists.length ? (
                  lists.map((list) => (
                    <Button
                      key={list.list_id}
                      size="sm"
                      style={{ marginBottom: "10px" }}
                      onClick={() =>
                        history.push({
                          pathname: `/users/${user.user.user_id}/lists`,
                          state: { selected_list: list },
                        })
                      }
                    >
                      {" "}
                      {list.is_private ? (
                        <FontAwesomeIcon
                          style={{ marginRight: "5px" }}
                          icon={faLock}
                        />
                      ) : (
                        <></>
                      )}
                      {list.list_name}
                    </Button>
                  ))
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    style={{ marginBottom: "10px" }}
                    disabled
                  >
                    Not in any :(
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        );
      }
    } else {
      return (
        <Card
          border={newRating.watch_status ? "success" : "secondary"}
          style={{ width: "18rem" }}
        >
          <Card.Header>
            <DropdownButton
              variant={newRating.watch_status ? "success" : "secondary"}
              title={newRating.watch_status ? "Watched" : "Plan to watch"}
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() =>
                  newRating.watch_status
                    ? setNewRating((prevState) => ({
                        ...prevState,
                        watch_status: 0,
                      }))
                    : setNewRating((prevState) => ({
                        ...prevState,
                        watch_status: 1,
                      }))
                }
              >
                {!newRating.watch_status ? "Watched" : "Plan to watch"}
              </Dropdown.Item>
            </DropdownButton>
          </Card.Header>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              <Card.Text>
                Your score:
                <Rating
                  name="read-only"
                  value={newRating.score}
                  max={10}
                  precision={1}
                  size="small"
                  onChange={(event, newScore) => {
                    setNewRating((prevState) => ({
                      ...prevState,
                      score: newScore,
                    }));
                  }}
                />
              </Card.Text>
            </ListGroupItem>
            <ListGroupItem>
              <Card.Title>Your review:</Card.Title>
              <Card.Text>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={newRating.review}
                  onChange={(event) => {
                    setNewRating((prevState) => ({
                      ...prevState,
                      review: event.target.value,
                    }));
                  }}
                />
              </Card.Text>
            </ListGroupItem>
          </ListGroup>
          <Card.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="float-right"
              size="sm"
              onClick={submitRating}
            >
              {ratingExists ? "Save" : "Add"}
            </Button>
          </Card.Footer>
        </Card>
      );
    }
  }
  return <></>;
};

const OthersRatings = (props) => {
  let [ratings, setRatings] = useState([]);
  let [onlyfriends, setOnlyFriends] = useState(false);
  useEffect(() => {
    console.log(props);
    fetchRatings();
  }, []);

  const fetchRatings = () => {
    console.log(props);
    fetch(`http://localhost:5000/movies/${props.movie_id}/ratings`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json && Object.keys(json).length && !json.msg) {
          setRatings(json);
        }
      });
  };

  return (
    <>
      {ratings.map((rating) => (
        <Card key={rating.user_id} style={{ marginBottom: "50px" }}>
          <Card.Header>{rating.username}</Card.Header>
          <Card.Body>
            <blockquote className="blockquote mb-0">
              <p> "{rating.review}" </p>
              <Card.Subtitle>
                <Rating
                  name="read-only"
                  value={rating.score}
                  max={10}
                  precision={1}
                  size="small"
                  readOnly
                />
              </Card.Subtitle>
            </blockquote>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

class MovieDetailed extends Component {
  static contextType = UserContext;

  state = {
    movie_id: this.props.movie_id,
    movie: [],
    genres: [],
    people: [],
  };

  constructor(props, context) {
    super(props, context);
    this.fetchMovie(this.state.movie_id);
    console.log(this.props);
    console.log(context);
  }

  fetchMovie(movie_id) {
    fetch(`http://localhost:5000/movies/${movie_id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ movie: json });
        this.setState({ people: json.people });
        this.setState({ genres: json.genres });
        console.log(this.state.people);
        console.log(this.state.genres);
      });
  }

  render() {
    console.log("hi2");
    return (
      <Container>
        <Row>
          <Col>
            <Image
              src="https://i.insider.com/5ca3d2b892c8866e8b4618d9?width=750&format=jpeg&auto=webp"
              style={{ width: "350px", height: "calc(350px * (40/27))" }}
              thumbnail
            />
            <div style={{ overflow: "hidden", position: "relative" }}>
              <Rating
                name="read-only"
                value={this.state.movie.avg_rating * 1.0}
                max={10}
                precision={0.1}
                size="large"
                readOnly
              />
            </div>
          </Col>
          <Col>
            <h1 className="display-4">{this.state.movie.movie_title}</h1>
            {this.state.genres.map((genre) => (
              <div key={genre.genre_id}>
                {capitalizeFirstLetter(genre.genre_name)}
              </div>
            ))}
            {this.state.movie.movie_description}
            <br></br>
            <br></br>
            <FullRating
              key={this.props.movie_id}
              movie_id={this.props.movie_id}
            />
          </Col>
        </Row>
        <div className="d-flex align-content-stretch flex-wrap bd-highlight example-parent person">
          {this.state.people.map((person) => (
            <div
              key={person.person_id}
              className="p-2 bd-highlight col-example"
            >
              <Card
                border="secondary"
                style={{ width: "160px", height: "300px" }}
              >
                <Card.Header>
                  {person.person_role == "NULL" ? "Crew" : "Cast"}
                </Card.Header>
                <Card.Img
                  variant="top"
                  src="https://pbs.twimg.com/profile_images/1209872683791343621/jyNHTtaD_400x400.jpg"
                  className="img-fluid"
                  style={{ width: "auto", height: "150px" }}
                />
                <Card.Body>
                  <Card.Title>{person.person_name}</Card.Title>
                  <Card.Text>
                    {person.person_role == "NULL"
                      ? capitalizeFirstLetter(person.cast_or_crew)
                      : "As " + parseRoles(person.person_role)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <OthersRatings movie_id={this.state.movie_id} />
      </Container>
    );
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseRoles(string) {
  var arr = string.split('"');
  var i;
  var result = "";
  for (i = 1; i < arr.length - 1; i += 1) {
    result = result + arr[i];
    if (i % 2 == 0) result += " ";
  }
  return result;
}

export default withRouter(MovieDetailed);
