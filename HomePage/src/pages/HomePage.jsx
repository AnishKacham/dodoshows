import search from "../images/search.svg";
import "../styles/HomePage.css";
import styled from "styled-components";
import React, { Component } from "react";

var people = ["127"];

class HomePage extends Component {
  
  state = {
    movies: []
  }

  constructor() {
    super();
    this.fetchMovies();
  }

  fetchMovies() {
    fetch("http://localhost:5000/movies/", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.state.movies = json;
        console.log(this.state.movies);
      });
  }

  arrangeMovies() {
    
  }

  ShowUserMenu() {
    document.getElementById("UserOptions").classList.toggle("show");
  }

  render() {
    const HoverText = styled.a`
      color: white;
      text-decoration: none;

      :hover {
        color: black;
        cursor: pointer;
      }
    `;
    const UserLinks = styled.a`
      color: white;
      text-decoration: none;

      :hover {
        color: #b0e0e6;
        cursor: pointer;
      }
    `;

    return (
      <body>
        <div className="MovieCard" />
        <div className="toppanel">
          <button className="profilepic" onClick={this.ShowUserMenu} />
          <div id="UserOptions" className="UserMenu">
            <div className="smallT" />
            <UserLinks href="#op1">Your movies</UserLinks>
            <br></br>
            <br></br>
            <UserLinks href="#op2">Your friends</UserLinks>
            <br></br>
            <br></br>
            <UserLinks href="#op3">Your ratings</UserLinks>
            <br></br>
            <br></br>
            <UserLinks href="#op4">Invert colour theme</UserLinks>
            <br></br>
            <br></br>
            <UserLinks href="#op5">Logout</UserLinks>
          </div>
        </div>

        <div className="search">
          <input type="image" src={search} className="search-logo" />
          <input
            type="text"
            className="SearchBar"
            placeholder="Search for a movie.."
          />
        </div>

        <div className="leftpanel">
          <p className="menu">
            <div className="r1" />
            <div className="r2" />
            <div className="r3" />
            <div className="r4" />
            <div className="r5" />

            <HoverText href="https://www.google.com"> Trending </HoverText>
            <br />
            <br />
            <HoverText href="https://www.google.com"> Your lists </HoverText>
            <br />
            <br />
            <HoverText href="https://www.google.com">
              {" "}
              Future Releases{" "}
            </HoverText>
            <br />
            <br />
            <HoverText href="https://www.google.com"> Watched </HoverText>
            <br />
            <br />
            <HoverText href="https://www.google.com"> About Us </HoverText>
          </p>
        </div>
      </body>
    );
  }
}
export default HomePage;
