import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { withRouter } from "react-router";


class TitleSearchResults extends Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.clickedOutside(true);
    }
  };

  render() {
    return (
      <div ref={this.wrapperRef} className={this.props.dropdownClasses}>
        {this.props.results.slice(0, 10).map((result) => (
          <NavDropdown.Item
            key={result.movie_id}
            onClick={() => {
              this.props.history.push(`/movies/${result.movie_id}`);
            }}
          >
            {result.movie_title}
          </NavDropdown.Item>
        ))}
      </div>
    );
  }
}

export default withRouter(TitleSearchResults);
