import { FullRating } from "./movieDetailed";
import React, { Component, useState } from "react";
import { useHistory, withRouter } from "react-router";
import { Modal, Form, Button } from "react-bootstrap";
import SearchBar from "./searchBar";

const RatingDialogue = (props) => {
  const [movie, setMovie] = useState({});
    const [hasSelectedMovie, setHasSelectedMovie] = useState(false);

  const getMovie = (movie_id, movie_title) => {
    console.log(movie_id);
    console.log(movie_title);
    setMovie({ movie_id: movie_id, movie_title: movie_title });
    setHasSelectedMovie(true);
  };
  const closeBox = () => {
    setMovie({});
    props.closeDialogue();
  };

  const MovieDisplay = () => {
    if (hasSelectedMovie) {
      return (
        <div>
          <Button onClick={() => setHasSelectedMovie(false)} style={{marginBottom: "10px"}}>
            {movie.movie_title}
          </Button>
        </div>
      );
    } else {
      return (
        <SearchBar entryDialogue={true} sendResult={getMovie} />
      );
    }
  };

  return (
    <Modal show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Add a movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MovieDisplay/>
        {hasSelectedMovie?<FullRating key={movie.movie_id} movie_id={movie.movie_id} showList={false}/>:<></>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeBox}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RatingDialogue;
