import React,{Component,useState,useEffect,useContext} from 'react';
import "../styles/HomePage.css";
import PersonCard from "../components/PersonCard"
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import { Form,InputGroup,CardDeck,Row,Col } from 'react-bootstrap';
import UserContext from "../contexts/userContext";
import {Button} from '@material-ui/core';

function FriendsPage(){
    let user = useContext(UserContext);
    const [image,setImage] = useState("")
    const [photoURL, setPhotoURL ] = useState("");
    const [friends,setFriends] = useState([]);
    const [incoming,setIncoming] = useState([]);
    const [outgoing,setOutgoing] = useState([]);
    useEffect(()=>{
        console.log(user);
        if(user.user.user_id!=undefined)fetchFriends();
    },[user])
    //_Upload Image Function
    const uploadImage= ()=>{
    console.log(image);
    const data = new FormData();
    data.append("upload_preset","pkftr8lo");
    data.append("file",image);   
    fetch("https://api.cloudinary.com/v1_1/dcowmd6uf/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
          if(data.error){
            console.log(data.error); 
           }
           else
           {
            console.log("url below");
            console.log(data.url);  
             }})
            }   
    //_Function to fetch all friends 
    const fetchFriends = ()=>{
        fetch(`http://localhost:5000/api/users/${user.user.user_id}/friends`,{
            method:"GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
        })
        .then(res=>res.json())
        .then(res=>{
            console.log("am I authorised?");            
            console.log(res);
            console.log(res.Friends);
            setFriends(res.Friends); 
            setIncoming(res.Incoming);
            setOutgoing(res.Outgoing);
        });
    }
    return(
        <>  
        <input accept="image/*" id="icon-button-file" type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        <Button variant="contained" onClick={uploadImage}>UPLOAD</Button> <br/><br/>      
        <TopBar/> 
        <br/>
        <Row style={{display:"flex",justifyContent:"flex-start"}}>
            <Col id="sidebar-wrapper" style={{maxWidth:"13rem"}}>
              <SideBar />
            </Col>
            {friends.map(friend=>{
                return(
                    <Col key={friend.user_id} style={{maxWidth:"20rem"}}>
                    <PersonCard personKey={friend.user_id} name={friend.username} status={friend.city_name} friendStat={2}/>
                    </Col>
                )
            })}
            {outgoing.map(outgoingreq=>{
                return(
                    <Col key={outgoingreq.user_id} style={{maxWidth:"20rem"}}>
                    <PersonCard personKey={outgoingreq.user_id} name={outgoingreq.username} status={outgoingreq.city_name} friendStat={1}/>
                    </Col>
                )
            })}
            {incoming.map(incomingreq=>{
                return(
                    <Col key={incomingreq.user_id} style={{maxWidth:"20rem"}}>
                    <PersonCard personKey={incomingreq.user_id} name={incomingreq.username} status={incomingreq.city_name} friendStat={3}/>
                    </Col>
                )
            })}
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={0} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={1} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={2} style={{maxWidth:"13rem"}}/>
            </Col>
            <Col>
            <PersonCard name="Kevon" status="super rixch" friendStat={3} style={{maxWidth:"13rem"}}/>
            </Col>
          </Row>
          {/* <Button variant="contained" color="primary">Material UI button?</Button> */}    
        </>
    );
}
export default FriendsPage;
