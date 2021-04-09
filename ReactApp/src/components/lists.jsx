import React, { Component } from "react";
import { withRouter } from "react-router";
import UserContext from "../contexts/userContext";
import List from "./list";
import { Table, Button, Col, Row, FormControl, Form } from "react-bootstrap";
import { MDBInput } from "mdbreact";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import AddList, { Dialogue } from "../components/addList";

class Lists extends Component {
  static contextType = UserContext;
  state = {
    entries: [],
    ratings: [],
    lists: this.props.lists,
    selected_all: this.props.selected_all,
    selected_list: this.props.selected_list,
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
      `http://localhost:5000/users/${this.props.match.params.id}/entries`,
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
      `http://localhost:5000/users/${this.props.match.params.id}/ratings`,
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
    console.log(this.state);
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
                    <i
                      className="fa fa-fw fa-sort"
                      onClick={() => this.toggleSort(1)}
                    ></i>
                  </th>
                  <th>
                    Watch Status
                    <i
                      className="fa fa-fw fa-sort"
                      onClick={() => this.toggleSort(2)}
                    ></i>
                  </th>
                </tr>
              </thead>
              <List
                key={this.state.sort}
                items={
                  !this.state.selected_all
                    ? this.state.entries
                        .filter(
                          (entry) =>
                            entry.list_id == this.state.selected_list.list_id
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
            <Button
              style={{ display: this.state.selected_all ? "none" : "block" }}
              onClick={() =>
                this.props.showEntryDialogue(this.state.selected_list)
              }
            >
              Add new entry
            </Button>
          </Col>
          <Col>
            <div className="btn-group-justified btn-group-vertical">
              <Button
                className={this.state.selected_all ? "btn-success" : null}
                style={{ marginBottom: "20px" }}
                onClick={() => this.setState({ selected_all: true })}
              >
                All
              </Button>
              <br></br>
              <br></br>
              {this.state.lists.map((list) =>
                list.list_id == this.state.selected_list.list_id &&
                !this.state.selected_all ? (
                  <Button
                    key={list.list_id}
                    className="btn-success"
                    style={{ marginBottom: "3px" }}
                    onClick={() => {
                      this.setState({
                        selected_list: list,
                        selected_all: false,
                      });
                      this.props.changeSelected(list);
                    }}
                  >
                    {list.list_name}
                  </Button>
                ) : (
                  <Button
                    key={list.list_id}
                    style={{ marginBottom: "3px" }}
                    onClick={() => {
                      this.setState({
                        selected_list: list,
                        selected_all: false,
                      });
                    }}
                  >
                    {list.list_name}
                  </Button>
                )
              )}
              <br></br>
              <br></br>
              <AddList onClick={this.props.showListDialogue} />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Lists);
