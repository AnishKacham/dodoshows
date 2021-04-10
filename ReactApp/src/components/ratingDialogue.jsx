import { FullRating } from "./movieDetailed";
import React, { Component, useState } from "react";
import { useHistory, withRouter } from "react-router";
import { Modal, Form, Button } from "react-bootstrap";
import SearchBar from "./searchBar";

const RatingDialogue = (props) => {
  const [movie, setMovie] = useState({});

  const getMovie = (movie_id, movie_title) => {
    console.log(movie_id);
    console.log(movie_title);
    setMovie({ movie_id: movie_id, movie_title: movie_title });
  };
  const closeBox = () => {
    setMovie({});
    props.closeDialogue();
  };

  return (
    <Modal show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Add a movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchBar entryDialogue={true} sendResult={getMovie} />
        {Object.keys(movie).length ? (
          <Button style={{ margin: "10px" }} key={movie.movie_id}>
            {movie.movie_title}
          </Button>
        ) : (
          <></>
        )}
        <FullRating movie_id={1}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeBox}>
          Close
        </Button>
        <Button variant="primary">Add movie</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RatingDialogue;
