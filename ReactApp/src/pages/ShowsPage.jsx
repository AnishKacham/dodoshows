import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router";
import { Card, Image, Container, Row, Col, Button} from "react-bootstrap";

class ShowsPage extends Component{
  
      constructor(props) {
        super(props);
        this.state={
            movie_id: this.props.location.state.movie_id,
            //startDate: new Date(),
            shows:[]
        }
        //console.log(this.props);
        this.fetchShows(this.state.movie_id);
      }
     /*handleChange = (date) => {
        this.setState({
          startDate: date
        })
      }
      onFormSubmit = (e) => {
       e.preventDefault();
       console.log(this.state.startDate);
       console.log(this.state.shows);
    }*/

      fetchShows(movie_id){
        fetch(`http://localhost:5000/movies/${movie_id}/shows`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
       this.setState({shows: json})
       
       console.log(json);
      });
      }
      render(){
          return (
       /* <form onSubmit={ this.onFormSubmit }>  
        <div className="form-group">
        <p className = "ShowTitle"> Choose Date and Time: </p>
          <DatePicker
              selected={ this.state.startDate }
              onChange={ this.handleChange }
              name="startDate"
              dateFormat="MM/dd/yyyy"
          />
         <button className="btn btn-primary">Set Date</button>
        </div>
      </form>*/
   <div className = "ShowList">
   {this.state.shows.map((show) => 
       (<div
          key={show.show_id}
          className="d-flex flex-column bd-highlight mb-3"
        >
      <Card bg="dark" text = "light">
  <Card.Header as="h5" >Featured</Card.Header>
  <Card.Body>
    <Card.Title>{show.theatre_mall}</Card.Title>
    <Card.Text>
      {show.date_time}
    </Card.Text>
    <Button variant="success" onClick={() => {
          this.props.history.push({pathname:`/shows/${show.show_id}/seats`, state:{show_id:show.show_id}});
          console.log(show.show_id);
        }}>Book Show</Button>
  </Card.Body>
</Card>
        
       </div>
   ))}
     </div>
 
      
          );
      }
}
export default withRouter(ShowsPage);