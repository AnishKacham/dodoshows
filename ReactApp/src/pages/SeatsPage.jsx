import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Image, Container, Row, Col, Button} from "react-bootstrap";
import Box from '@material-ui/core/Box';
import "../styles/SeatsPage.css";
import { TableRow } from "@material-ui/core";

var BookedSeats = []
let sl = ['A','B','C','D','E','F','G'];
var sn=[];
var i;

for(i=1;i<31;i++)sn.push(i);

class SeatsPage extends Component{
    
    constructor(props){
        
        super(props);
        this.state={
            show_id: this.props.location.state.show_id,
            seats:[],
            code_letters:[],
            code_numbers:[]
        };
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
                <button  className="seat-btn"style ={{backgroundColor:"red", borderRadius:"13px"}} id = {code} >{code}</button>
            );
        }
        else{
            return(
                <button className="seat-btn" style ={{borderRadius:"13px"}} id = {code} onClick={()=>this.SeatSelect(code)}>{code}</button>
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

    fetchSeats=(show_id)=>{
        fetch(`http://localhost:5000/api/shows/${show_id}/seats`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        
      },
    })
      .then((response) => response.json())
      .then((json) => {
        json = this.SortSeats(json);
        this.setState({seats: json});
        var i;
        var j;
        let l = new Set();
        let n = new Set();
        for(i=0;i<json.length;i++){
           l.add(json[i].seat_code.charAt(0));
           n.add(json[i].seat_code.slice(1));
        }
        this.setState({code_letters: Array.from(l),code_numbers:Array.from(n)});
        console.log("code_letters:",this.state.code_letters); // Gives proper sorted seats array
      });
    }
    
      render(){
          if(this.state.seats.length && this.state.code_letters.length && this.state.code_numbers.length){
          return(
              <>
              <div className="page-container">
              
              <div><p className = "seattitle">SELECT YOUR SEATS</p></div>
              
              
              <div /* class="container-fluid" */ className="btns-container" /* style={{border:"10px solid black",backgroundColor:"grey", width:"fit-content"}} */>
              
                  {this.state.code_letters.map((letters,index) =>
                  ( <Row style={{flexWrap:"nowrap", width:"900px", justifyContent:"space-around"}}>
                   
                      {this.state.code_numbers.map((numbers)=>(
                      <Col key={numbers} style={{paddingRight:"0px"}}>
                          <br></br>
                          {console.log("Check: ", this.state)}
                          {this.SeatCheck(letters+numbers,this.state.seats[index*this.state.code_numbers.length + parseInt(numbers)-1].seat_status)}
                          
                          
                         
                      </Col>
                      ))
                    }
                      </Row>
                  ))
                   }
                   

              </div>
              <hr/>
              <div>
              <p className = "screen">SCREEN HERE</p>
              <br/><br/>
              <br/><br/>
              <Button variant="success" 
              style={{width: "50%",height: "100px",marginRight: "25%",marginLeft: "25%",
              fontSize:"30px", borderRadius:"100px"}} onClick={() => {
                this.props.history.push({pathname:`/shows/${this.state.show_id}/book`, state:{SeatsBooked:BookedSeats,show_id:this.state.show_id}});
                
              }}>Proceed to pay</Button>
              </div>
              </div>
              </>

          );
            }
            else{
                return(<></>);
            }
      }
    
}
export default withRouter(SeatsPage);