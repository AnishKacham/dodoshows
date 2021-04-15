import React, { Component } from "react";
import { withRouter } from "react-router";
import {Button} from "react-bootstrap";
import "../styles/AdminConsole.css";
class AdminConsole extends Component{
    constructor(props){
        super(props);
        this.state={
            MID:"",
            TID:"",
            DT:"",
            TP:""
        }
        
    }

    
    SetValue=(event)=>{
        this.setState({[event.target.name]: event.target.value})
        console.log(this.state);
    }
    AddShow=()=>{
        console.log("Entered");
        fetch(`http://localhost:5000/api/shows/`, {
            method: "POST",
            body: JSON.stringify({
                movie_id: parseInt(this.state.MID),
                  theatre_id: parseInt(this.state.TID),
                  date_time:this.state.DT,
                  ticket_price: parseInt(this.state.TP)
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          })
            .then((response) => response.json())
            .then((json) => {
             console.log("From addshows: ",json);
            });
    }

    render(){
        return(
            <>
            <div className="ConsoleHeader"> <Button variant = "success" size="sm" style={{position:"absolute",marginLeft:"30px",top:"30%"}} onClick={() => {
                this.props.history.push("/");
              }}>Back to Home</Button> <p className = "Header"> ADMIN CONSOLE</p> </div>

            <div className ="AddZone"> 
            <p className = "ConsoleTitle" ><u><b>SET SHOW DETAILS</b></u>  </p>

            <form style={{marginLeft:"30px", marginTop:"80px"}} onSubmit = {this.AddShow}>

            <label htmlFor="MID" style={{color:"green"}}>Movie ID:</label><br/>
            <input type="text" id="MID" name="MID" value = {this.state.MID} onChange={this.SetValue}/><br/><br/>

            <label htmlFor="TID" style={{color:"green"}}>Theatre ID:</label><br/>
            <input type="text" id="TID" name="TID" value = {this.state.TID} onChange={this.SetValue}/><br/><br/>

            <label htmlFor="TP" style={{color:"green"}}>Ticket Price:</label><br/>
            <input type="text" id="TP" name="TP" value = {this.state.TP} onChange={this.SetValue}/><br/><br/>

            <label htmlFor="DT" style={{color:"green"}}>Date-Time(Please enter in YYYY-MM-DD HH:MM:SS format):</label><br/>
            <input type="text" id="DT" name="DT" value = {this.state.DT} onChange={this.SetValue}/><br/><br/>

            <input type="submit" value="Add Show" style={{backgroundColor: "Yellow",position: "relative",marginLeft:"30%",marginRight:"30%", width:"40%"}}/>
            </form>

            </div>

            </>

        );
    }
}

export default withRouter(AdminConsole);