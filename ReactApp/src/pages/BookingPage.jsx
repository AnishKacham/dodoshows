import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Image, Container, Row, Col, Button} from "react-bootstrap";
import PaymentButton from "../components/PaymentButton";
import "../styles/BookingPage.css";

class BookingPage extends Component{
    constructor(props){
        super(props);
        this.state={
            BSeats: this.props.location.state.SeatsBooked, 
            show_id: this.props.location.state.show_id
        }
        console.log(this.state.BSeats);
    }

    Book(seats,show_id){
        fetch(`http://localhost:5000/api/shows/${show_id}/book`, {
      method: "POST",
      body: JSON.stringify({
            seats: seats,
            paymentDeets: "hi"
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
     
            <div className="GPay">
                <p className = "Thanks">Thank you! Please complete your booking by paying below. Make sure to receive your ticket! Enjoy</p>
                <Button variant="info" size = "lg" block>Payment Gateway</Button>
                <br/>
                <br/>
               
                <Button variant="success" size = "lg" onClick={()=> this.Book(this.state.BSeats,this.state.show_id)} block style={{boxShadow:"3px 4px"}}>Send ticket</Button>
                <br/>
                <br/>
                <Button variant="warning" size = "lg" block onClick={() => {
                this.props.history.push("/");
              }}>Back to Home</Button>
                <br/>
                <br/>
                <br/><br/><br/><br/>
            </div>
           
          
        );
    }
}

export default withRouter(BookingPage);

