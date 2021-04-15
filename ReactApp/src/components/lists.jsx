import React, { Component } from "react";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";
import List from "./list";
import { Table, Button, Col, Row, FormControl, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSort } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import AddList, { Dialogue } from "../components/addList";

class Lists extends Component {
  static contextType = UserContext;
  state = {
    entries: [],
    ratings: [],
    showWatched: true,
    showUnwatched: true,
    searchString: "",
    sortMode: 1,
    sort: 0,
  };

  constructor(props, context) {
    super(props, context);
    console.log(this.props);
  }

  componentDidMount() {
    this._isMounted = true;

    this.fetchEntries()
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          console.log(this.context.user);
          localStorage.setItem("lastLoc", `${this.props.location.pathname}`);
          this.props.history.push("/login");
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (this._isMounted) {
          this.setState({ entries: json });
        }
      });
    this.fetchRatings()
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          console.log(this.context.user);
          localStorage.setItem("lastLoc", `${this.props.location.pathname}`);
          this.props.history.push("/login");
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (this._isMounted) {
          this.setState({ ratings: json });
        }
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchEntries = () => {
    return fetch(
      `http://localhost:5000/api/users/${this.props.match.params.id}/entries`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
  };
  fetchRatings = () => {
    return fetch(
      `http://localhost:5000/api/users/${this.props.match.params.id}/ratings`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
  };

  toggleWatched = () => {
    console.log("watched");
    this.state.showWatched
      ? this.setState({ showWatched: false })
      : this.setState({ showWatched: true });
  };
  toggleUnwatched = () => {
    console.log("unwatched");
    this.state.showUnwatched
      ? this.setState({ showUnwatched: false })
      : this.setState({ showUnwatched: true });
  };
  toggleSort = (mode) => {
    this.state.sortMode == mode
      ? this.state.sort == -1
        ? this.setState({ sort: 1 })
        : this.setState({ sort: -1 })
      : this.setState({ sortMode: mode });
  };

  render() {
    console.log(this.props);
    return (
      <>
        <Row>
          <Col>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.showWatched}
                  onChange={this.toggleWatched}
                  name="watched"
                />
              }
              label="Watched"
            />
          </Col>
          <Col>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.showUnwatched}
                  onChange={this.toggleUnwatched}
                  name="unwatched"
                />
              }
              label="Plan to watch"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Movie
                      </Form.Label>
                      <Col sm={10}>
                        <FormControl
                          value={this.state.searchString}
                          type="text"
                          placeholder="Search..."
                          onChange={(event) =>
                            this.setState({ searchString: event.target.value })
                          }
                        />
                      </Col>
                    </Form.Group>
                  </th>
                  <th>
                    Score
                    <FontAwesomeIcon
                      style={{ marginLeft: "5px" }}
                      icon={faSort}
                      onClick={() => this.toggleSort(1)}
                    />
                  </th>
                  <th>
                    Watch Status
                    <FontAwesomeIcon
                      style={{ marginLeft: "5px" }}
                      icon={faSort}
                      onClick={() => this.toggleSort(2)}
                    />
                  </th>
                </tr>
              </thead>
              <List
                key={this.state.sort}
                items={
                  !this.props.selected_all
                    ? this.state.entries
                        .filter(
                          (entry) =>
                            entry.list_id == this.props.selected_list.list_id
                        )
                        .filter((entry) => {
                          if (this.state.showWatched && entry.watch_status == 1)
                            return true;
                          else if (
                            this.state.showUnwatched &&
                            entry.watch_status == 0
                          )
                            return true;
                          return false;
                        })
                        .filter(
                          (entry) =>
                            entry.movie_title
                              .toLowerCase()
                              .search(this.state.searchString.toLowerCase()) >=
                            0
                        )
                        .sort((a, b) => {
                          if (this.state.sortMode == 1)
                            return (a.score - b.score) * this.state.sort;
                          if (this.state.sortMode == 2)
                            return (
                              (a.watch_status - b.watch_status) *
                              this.state.sort
                            );
                        })
                    : this.state.ratings
                        .filter((entry) => {
                          if (this.state.showWatched && entry.watch_status == 1)
                            return true;
                          else if (
                            this.state.showUnwatched &&
                            entry.watch_status == 0
                          )
                            return true;
                          return false;
                        })
                        .filter(
                          (entry) =>
                            entry.movie_title
                              .toLowerCase()
                              .search(this.state.searchString.toLowerCase()) >=
                            0
                        )
                        .sort((a, b) => {
                          if (this.state.sortMode == 1)
                            return (a.score - b.score) * this.state.sort;
                          if (this.state.sortMode == 2)
                            return (
                              (a.watch_status - b.watch_status) *
                              this.state.sort
                            );
                        })
                }
              />
            </Table>
            {this.props.isOwner? <><Button
              style={{ display: this.props.selected_all ? "none" : "block" }}
              onClick={() =>
                this.props.showEntryDialogue(this.props.selected_list)
              }
            >
              + Add movie to this list
            </Button>
            <Button
              style={{ display: this.props.selected_all ? "block" : "none" }}
              onClick={() =>
                this.props.showRatingDialogue()
              }
            >
              + Add movie
            </Button></>: <></>}
            
          </Col>
          <Col>
            <div className="btn-group-justified btn-group-vertical">
              <Button
                className={this.props.selected_all ? "btn-success" : null}
                style={{ marginBottom: "20px" }}
                onClick={() => this.props.setSelectedAll(true)}
              >
                All
              </Button>
              <br></br>
              <br></br>
              {this.props.lists.map((list) => (
                <Button
                  key={list.list_id}
                  className={
                    list.list_id == this.props.selected_list.list_id &&
                    !this.props.selected_all
                      ? "btn-success"
                      : "btn-primary"
                  }
                  style={{ marginBottom: "3px" }}
                  onClick={() => {
                    this.props.setSelectedAll(false);
                    this.props.changeSelected(list);
                  }}
                >
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
              ))}
              <br></br>
              <br></br>
              {this.props.isOwner? <AddList onClick={this.props.showListDialogue} /> : <></>}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Lists);
