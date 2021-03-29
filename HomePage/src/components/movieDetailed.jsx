import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "../styles/personCard.css";

class MovieDetailed extends Component {
  state = {
    movie_id: this.props.movie_id,
    movie: [],
    genres: [],
    people: [],
  };

  constructor(props) {
    super(props);
    this.fetchMovie(this.state.movie_id);
    console.log(this.props);
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
      });
  }

  render() {
    return (
      <div className="d-flex align-content-stretch flex-wrap bd-highlight example-parent">
        {this.state.people.map((person) => (
          <div key={person.person_id} className="p-2 bd-highlight col-example">
            <Card
              border="secondary"
              style={{ width: "160px", height: "300px" }}
            >
                <Card.Header>
                {person.person_role == "NULL"
                    ? "Crew"
                    : "Cast"}
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
    );
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function parseRoles(string) {
    var arr = string.split("\"");
    var i;
    var result = "";
    for(i=1; i<arr.length-1; i+=1)
    {
        result = result + arr[i];
        if(i%2==0)
        result += " "
    }
    return result;
}

export default MovieDetailed;
