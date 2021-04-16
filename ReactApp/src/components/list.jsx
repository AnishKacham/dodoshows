import React, { Component, useState } from "react";
import { useHistory, withRouter } from "react-router";
import { Modal, Form, Button } from "react-bootstrap";
import SearchBar from "./searchBar";

const EntryDialogue = (props) => {
  let history = useHistory();
  const [movie, setMovie] = useState("");
  const [list, setList] = useState("");
  const [movies, setMovies] = useState([]);

  const postMovies = (event) => {
    event.preventDefault();
    console.log(localStorage.getItem("jwt"));
    if (movies.length) {
      const movie_ids = movies.map((movie) => movie.movie_id);
      console.log(movie_ids);
      fetch(`http://localhost:5000/api/lists/${props.list.list_id}`, {
        method: "POST",
        body: JSON.stringify({
          movie_ids,
        }),
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
          closeBox();
          props.reloadPage();
        });
    }
  };

  function containsId(id, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].movie_id === id) {
        return true;
      }
    }

    return false;
  }
  const getMovie = (movie_id, movie_title) => {
    console.log(movie_id);
    console.log(movie_title);
    if (!containsId(movie_id, movies))
      setMovies((oldArray) => [
        ...oldArray,
        { movie_id: movie_id, movie_title: movie_title },
      ]);
  };
  const removeMovie = (m) => {
    setMovies(movies.filter((movie) => movie != m));
  };
  const closeBox = () => {
    setMovies([]);
    props.closeDialogue();
  };

  return (
    <Modal show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Add Entry to list "{props.list.list_name}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchBar entryDialogue={true} sendResult={getMovie} />
        {movies.map((movie) => (
          <Button
            style={{ margin: "10px" }}
            key={movie.movie_id}
            onClick={() => removeMovie(movie)}
          >
            {movie.movie_title}
          </Button>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeBox}>
          Close
        </Button>
        <Button variant="primary" onClick={postMovies}>
          Add movies
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

class List extends Component {
  state = {};

  constructor(props) {
    super(props);
    console.log(props);
  }

  clicked = (id) => {
    console.log("clicked");
    this.props.history.push(`/movies/${id}`);
  };
  render() {
    return (
      <tbody>
        {this.props.items.map((item, i) => (
          <tr key={item.movie_id.toString()}>
            <td>{i + 1}</td>
            <td onClick={() => this.clicked(item.movie_id)}>
              {item.movie_title}
            </td>
            <td>{item.score ? item.score/2 : "--"}</td>
            <td>{item.watch_status ? "Watched" : "Plan to watch"}</td>
          </tr>
        ))}
      </tbody>
    );
  }
}

export { EntryDialogue };
export default withRouter(List);
