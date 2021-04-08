import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Image, Container, Row, Col, Button} from "react-bootstrap";
import "../styles/SeatsPage.css";

class SeatsPage extends Component{
    constructor(props){
        super(props);
        this.state={
            show_id: this.props.location.state.show_id,
            seats:[]

        }
        this.fetchSeats(this.state.show_id);

    }

    SeatSelect(id){
        //console.log("Pressed");
        document.getElementById(id).classList.toggle("select");
        
    }

 

    fetchSeats(show_id){
        fetch(`http://localhost:5000/shows/${show_id}/seats`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
       this.setState({seats: json})
       
       console.log(json);
      });
    }
      render(){
          return(
              <>
              <br/>
              <p className = "seattitle">Select Your Seats</p>
              
              <br/>
              <div className="d-flex align-content-stretch flex-wrap">
                  {this.state.seats.map((seats,index) =>
                  (
                      <div key={seats.seat_code} >
                          <button style ={{width:"76px", height:"60px"}} id = {seats.seat_code} onClick={()=>this.SeatSelect(seats.seat_code)}>{seats.seat_code}</button>
                      </div>
                        
                      ))
                   }

              </div>
              <hr size='30px' color="blue"/>
              <p className = "screen">Screen here</p>
              <br/><br/>
              <br/><br/>
              <Button variant="success" style={{width: "50%",height: "100px",marginRight: "25%",marginLeft: "25%",fontSize:"30px", borderRadius:"100px"}}>Proceed to pay</Button>
              
              </>

          );
      }
    
}
export default withRouter(SeatsPage);