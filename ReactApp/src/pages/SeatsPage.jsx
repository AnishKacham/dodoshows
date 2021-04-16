import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Image, Container, Row, Col, Button} from "react-bootstrap";
import Box from '@material-ui/core/Box';
import "../styles/SeatsPage.css";
import { TableRow } from "@material-ui/core";

var BookedSeats = []
class SeatsPage extends Component{
    constructor(props){
        super(props);
        this.state={
            show_id: this.props.location.state.show_id,
            seats:[]
        }
        this.fetchSeats(this.state.show_id);
    }
    
    RemoveSeat(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
      }

    SeatSelect=(id)=>{
        //console.log("Pressed");
        let t = document.getElementById(id).classList.toggle("select");
        if(t==true){
            BookedSeats.push(id);
        }
        else{
            this.RemoveSeat(BookedSeats,id);
            
        }
    }

    SeatCheck=(code,status)=>{
        if(status==0){
            return(
                <button style ={{width:"76px", height:"60px", backgroundColor:"red", borderRadius:"20px", boxShadow:"3px 4px"}} id = {code} >{code}</button>
            );
        }
        else{
            return(
                <button style ={{width:"76px", height:"60px", borderRadius:"20px",boxShadow:"3px 4px"}} id = {code} onClick={()=>this.SeatSelect(code)}>{code}</button>
            );
        }
    }

    SortSeats=(a)=>{
        let i;
        let j;
        for(i=0;i<a.length;i++){
            for(j=0;j<a.length-1;j++){
                let n = parseInt(a[j].seat_code.slice(1));
                let m = parseInt(a[j+1].seat_code.slice(1));
                let c = a[j].seat_code.charAt(0);
                let d = a[j+1].seat_code.charAt(0);
                if(c.localeCompare(d)==0){
                    if(n>m){
                        let temp = a[j];
                        a[j]=a[j+1];
                        a[j+1]=temp;
                    }
                }
            }
        }
        return a;
    }

    fetchSeats(show_id){
        fetch(`/api/shows/${show_id}/seats`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        
      },
    })
      .then((response) => response.json())
      .then((json) => {
       this.setState({seats: this.SortSeats(json)})
       console.log("Sorted seats:",this.SortSeats(json));
      });
    }
    
      render(){
          return(
              <>
              <br/>
              <p className = "seattitle">SELECT YOUR SEATS</p>
              
              <br/>
              <div class="container-xxl" style={{border:"10px solid black", marginLeft:"10px",marginRight:"10px",marginTop:"10px", backgroundColor:"grey"}}>

                  <Row>
                  {this.state.seats.map((seats) =>
                  (
                      <Col key={seats.seat_code} >
                           <br/>
                          {this.SeatCheck(seats.seat_code,seats.seat_status)}
                          <br/>
                         
                      </Col>
                        
                      ))
                   }
                   </Row>

              </div>
              <hr size='30px' color="blue"/>
              <p className = "screen">SCREEN HERE</p>
              <br/><br/>
              <br/><br/>
              <Button variant="success" 
              style={{width: "50%",height: "100px",marginRight: "25%",marginLeft: "25%",
              fontSize:"30px", borderRadius:"100px"}} onClick={() => {
                this.props.history.push({pathname:`/shows/${this.state.show_id}/book`, state:{SeatsBooked:BookedSeats,show_id:this.state.show_id}});
                
              }}>Proceed to pay</Button>
              
              </>

          );
      }
    
}
export default withRouter(SeatsPage);